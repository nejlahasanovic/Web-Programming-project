let LatestNewsService = {

  currentArticleId: null,

  init: function () {
    LatestNewsService.loadLatestArticle();
  },

  loadLatestArticle: function () {
    $.blockUI({ message: '<h3>Loading latest article...</h3>' });

    RestClient.get(
      'articles/with-comments',
      function (response) {
        const articles = Array.isArray(response)
          ? response
          : (response.data || []);

        if (!articles.length) {
          $.unblockUI();
          LatestNewsService.showNoArticles();
          return;
        }

        const article = articles[0];
        LatestNewsService.currentArticleId = article.article_id;

        LatestNewsService.renderArticle(article);
        LatestNewsService.loadComments(article.article_id);
        LatestNewsService.setupCommentForm();

        $.unblockUI();
      },
      function () {
        $.unblockUI();
        toastr.error("Failed to load latest article");
      }
    );
  },

  renderArticle: function (article) {
    $('#latest-article-title').text(article.title);

    $('#latest-article-image').attr(
      'src',
      article.image_url ||
      '/90minut/frontend/assets/img/blog/details/details-hero.jpg'
    );

    $('#latest-article-time').text(
      LatestNewsService.getTimeAgo(article.published_at)
    );

    $('#latest-comment-count').text(article.comment_count || 0);

    const paragraphs = (article.content || '')
      .split('\n')
      .filter(p => p.trim() !== '');

    let html = '';
    paragraphs.forEach(p => {
      html += `<p>${p}</p>`;
    });

    $('#latest-article-content').html(html);
  },

  loadComments: function (articleId) {
    RestClient.get(
      'comments/article/' + articleId,
      function (response) {
        const comments = Array.isArray(response)
          ? response
          : (response.data || []);

        $('#latest-total-comments').text(comments.length);

        if (!comments.length) {
          $('#latest-comments-list').html(
            '<p>No comments yet. Be the first to comment!</p>'
          );
          return;
        }

        let html = '';

        comments.forEach(function (comment) {
          const username = comment.username;
          const date = LatestNewsService.formatDate(comment.created_at);

          html += `
            <div class="single-comment-item" style="margin-bottom:30px; overflow:hidden;">
              <div class="sc-author" style="float:left; margin-right:20px;">
                <img
                  src="https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&size=70&background=dd1515&color=fff"
                  alt="${username}"
                  style="width:70px;height:70px;border-radius:50%;">
              </div>
              <div class="sc-text" style="overflow:hidden;">
                <span style="font-size:12px;color:#dd1515;">${date}</span>
                <h5 style="color:#ffffff;font-weight:500;margin-top:8px;margin-bottom:14px;">
                  ${username}
                </h5>
                <p style="font-size:14px;line-height:22px;color:#e0e0e0;">
                  ${comment.content}
                </p>
              </div>
            </div>
          `;
        });

        $('#latest-comments-list').html(html);
      },
      function () {
        toastr.error("Failed to load comments");
      }
    );
  },

  setupCommentForm: function () {
    const token = localStorage.getItem("user_token");

    if (!token) {
      $('#latest-comment-form-section').html(`
        <div class="alert alert-info">
          <p><i class="fa fa-info-circle"></i> You must be <a href="#" onclick="window.location.href='/90minut/frontend/login.html'; return false;">logged in</a> to comment.</p>
        </div>
      `);
      return;
    }

    $("#latest-add-comment-form").validate({
      rules: {
        content: {
          required: true,
          minlength: 10,
          maxlength: 1000
        }
      },
      messages: {
        content: {
          required: "Please enter your comment",
          minlength: "Comment must be at least 10 characters",
          maxlength: "Comment cannot exceed 1000 characters"
        }
      },
      submitHandler: function(form) {
        const content = $(form).find('textarea[name="content"]').val().trim();
        
        LatestNewsService.addComment({
          article_id: LatestNewsService.currentArticleId,
          content: content
        });
      }
    });
  },

  addComment: function (data) {
    $.blockUI({ message: '<h3>Posting comment...</h3>' });

    RestClient.post(
      'comments',
      data,
      function () {
        $.unblockUI();
        toastr.success("Comment added successfully!");
        $('#latest-add-comment-form')[0].reset();
        LatestNewsService.loadComments(LatestNewsService.currentArticleId);
      },
      function (err) {
        $.unblockUI();
        toastr.error(err.responseText || "Error adding comment");
      }
    );
  },

  getTimeAgo: function (dateString) {
    if (!dateString) return '';

    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 60000);

    if (diff < 60) return diff + 'min';
    if (diff < 1440) return Math.floor(diff / 60) + 'h';
    return Math.floor(diff / 1440) + 'd';
  },

  formatDate: function (dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString();
  },

  showNoArticles: function () {
    $('#latest-article-title').text('No articles available');
    $('#latest-article-content').html('');
    $('#latest-comment-count').text('0');
    $('#latest-total-comments').text('0');
    $('#latest-comments-list').html('');
  }
};