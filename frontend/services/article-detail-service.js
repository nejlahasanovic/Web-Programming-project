let ArticleDetailService = {
  
  currentArticleId: null,

  init: function(articleId) {
    
    ArticleDetailService.currentArticleId = articleId;
    
   
    ArticleDetailService.loadArticle(articleId);
    
  
    ArticleDetailService.loadComments(articleId);
    
  
    ArticleDetailService.loadRecentPosts();
    
 
    ArticleDetailService.setupCommentForm();
  },

 
  loadArticle: function(articleId) {
    RestClient.get('articles/' + articleId, 
      function(response) {
        const article = response.data || response;
        
    
        $('#article-title').text(article.title);
        $('#article-breadcrumb-title').text(article.title);
        
        const date = ArticleDetailService.formatDate(article.published_at);
        $('#article-date').text(date);
        $('#article-author').text(article.author_name || 'Admin');
        
        if (article.image_url) {
          $('#article-image-container').html(`
            <img src="${article.image_url}" alt="${article.title}" style="width: 100%; margin-bottom: 30px; border-radius: 8px;">
          `);
        }
        

        $('#article-content').html(`<p>${article.content}</p>`);

        $('#article-tags').html(`
          <a href="#blog">Football</a>
          <a href="#blog">News</a>
        `);
    
        $('.set-bg').each(function() {
          var bg = $(this).data('setbg');
          $(this).css('background-image', 'url(' + bg + ')');
        });
      },
      function(error) {
        console.error("Error loading article:", error);
        $('#article-title').text('Article not found');
        $('#article-content').html('<p class="text-danger">Article could not be loaded.</p>');
      }
    );
  },

  loadComments: function(articleId) {
  RestClient.get('comments/article/' + articleId, 
    function(response) {
      const comments = Array.isArray(response) ? response : (response.data || []);
      
      $('#total-comments').text(comments.length);
      $('#article-comments-count').text(comments.length + ' Comments');
      
      if (comments.length === 0) {
        $('#comments-list').html('<p>No comments yet. Be the first to comment!</p>');
        return;
      }
      
      let html = '';
      comments.forEach(function(comment) {
        const date = ArticleDetailService.formatDate(comment.created_at);
        const username = comment.username || 'Anonymous';
        
        html += `
          <div class="single-comment-item" style="margin-bottom: 30px; overflow: hidden;">
            <div class="sc-author" style="float: left; margin-right: 20px;">
              <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&size=70&background=dd1515&color=fff" 
                   alt="${username}" 
                   style="width: 70px; height: 70px; border-radius: 50%;">
            </div>
            <div class="sc-text" style="overflow: hidden;">
              <span style="font-size: 12px; color: #dd1515;">${date}</span>
              <h5 style="color: #ffffff; font-weight: 500; margin-top: 8px; margin-bottom: 14px;">${username}</h5>
              <p style="font-size: 14px; line-height: 22px; color: #e0e0e0;">${comment.content}</p>
            </div>
          </div>
        `;
      });
      
      $('#comments-list').html(html);
    },
    function(error) {
      console.error("Error loading comments:", error);
      $('#comments-list').html('<p>Error loading comments.</p>');
    }
  );
},
  
  loadRecentPosts: function() {
    RestClient.get('articles?limit=5&published=1', 
      function(response) {
        const articles = Array.isArray(response) ? response : (response.data || []);
        
        let html = '';
        articles.slice(0, 5).forEach(function(article) {
          const imageUrl = article.image_url || '/90minut/frontend/assets/img/news/ln-1.jpg';
          const date = ArticleDetailService.formatDate(article.published_at);
          
          html += `
            <div class="news-item">
              <div class="ni-pic">
                <img src="${imageUrl}" alt="${article.title}">
              </div>
              <div class="ni-text">
                <h5><a href="#article?id=${article.article_id}">${article.title}</a></h5>
                <ul>
                  <li><i class="fa fa-calendar"></i> ${date}</li>
                </ul>
              </div>
            </div>
          `;
        });
        
        $('#recent-posts-widget').html(html);
      },
      function(error) {
        console.error("Error loading recent posts:", error);
      }
    );
  },

  setupCommentForm: function() {
   
    const token = localStorage.getItem("user_token");
    
    if (!token) {
    
      $('#comment-form-section').html(`
        <div class="alert alert-info">
          <p><i class="fa fa-info-circle"></i> You must be <a href="#" onclick="window.location.href='/90minut/frontend/login.html'; return false;">logged in</a> to comment.</p>
        </div>
      `);
      return;
    }
    
    $('#comment-article-id').val(ArticleDetailService.currentArticleId);
    
    $(document).off('submit', '#add-comment-form').on('submit', '#add-comment-form', function(e) {
      e.preventDefault();
      
      const content = $(this).find('textarea[name="content"]').val();
      
      if (!content || content.trim().length < 10) {
        toastr.error("Comment must be at least 10 characters long.");
        return;
      }
      
      const data = {
        article_id: ArticleDetailService.currentArticleId,
        content: content.trim()
      };
      
      ArticleDetailService.addComment(data);
    });
  },

  addComment: function(data) {
  RestClient.post('comments', data, 
    function(response) {
      toastr.success("Comment added successfully!");

      $('#add-comment-form')[0].reset();

      ArticleDetailService.loadComments(
        ArticleDetailService.currentArticleId
      );
    },
    function(error) {
      console.error("Error adding comment:", error);
      toastr.error(
        error.responseText || 
        "Error adding comment. Please make sure you are logged in."
      );
    }
  );
},


  formatDate: function(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
};