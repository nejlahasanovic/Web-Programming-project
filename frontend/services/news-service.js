let NewsService = {

  allArticles: [],
  currentPage: 1,
  articlesPerPage: 9,

  init: function() {
    NewsService.loadAllArticles();
    NewsService.setupPagination();
  },

  loadAllArticles: function() {
    RestClient.get('articles/with-comments', 
      function(data) {
        console.log("News articles loaded:", data);
        
        const articles = Array.isArray(data) ? data : (data.data || []);
        
        NewsService.allArticles = articles.sort(function(a, b) {
          return new Date(b.published_at) - new Date(a.published_at);
        });
        
        NewsService.currentPage = 1;
        NewsService.renderCurrentPage();
      },
      function(jqXHR) {
        console.error("Error loading news:", jqXHR);
        toastr.error("Failed to load news articles");
      }
    );
  },

  setupPagination: function() {

    $('#btn-newer').off('click').on('click', function() {
      if (NewsService.currentPage > 1) {
        NewsService.currentPage--;
        NewsService.renderCurrentPage();
        window.scrollTo(0, 0);
      }
    });

    $('#btn-older').off('click').on('click', function() {
      const totalPages = Math.ceil(NewsService.allArticles.length / NewsService.articlesPerPage);
      
      if (NewsService.currentPage < totalPages) {
        NewsService.currentPage++;
        NewsService.renderCurrentPage();
        window.scrollTo(0, 0);
      }
    });
  },

  renderCurrentPage: function() {
    const totalPages = Math.ceil(NewsService.allArticles.length / NewsService.articlesPerPage);
    const startIndex = (NewsService.currentPage - 1) * NewsService.articlesPerPage;
    const endIndex = startIndex + NewsService.articlesPerPage;
    
    const articlesToShow = NewsService.allArticles.slice(startIndex, endIndex);
    
    NewsService.renderArticles(articlesToShow);
    NewsService.updatePaginationButtons(totalPages);
  },

  updatePaginationButtons: function(totalPages) {
   
    $('#pagination-info').text(`Page ${NewsService.currentPage} of ${totalPages}`);
    
    if (NewsService.currentPage === 1) {
      $('#btn-newer').prop('disabled', true).addClass('disabled');
    } else {
      $('#btn-newer').prop('disabled', false).removeClass('disabled');
    }
    
    if (NewsService.currentPage === totalPages) {
      $('#btn-older').prop('disabled', true).addClass('disabled');
    } else {
      $('#btn-older').prop('disabled', false).removeClass('disabled');
    }
  },

  renderArticles: function(articles) {
    const container = $('#news-articles-container');
    
    if (!container.length) {
      console.warn("Container #news-articles-container not found!");
      return;
    }

    if (articles.length === 0) {
      container.html('<p class="text-center">No news articles available.</p>');
      return;
    }

    let html = '';
    
    articles.forEach(function(article, index) {
      const title = article.title;
      const excerpt = article.content ? article.content.substring(0, 150) + '...' : 'No content available.';
      const imageUrl = article.image_url || '/90minut/frontend/assets/img/blog/blog-2.jpg';
      const date = NewsService.formatDate(article.published_at);
      const commentCount = article.comment_count || 0;
      const articleId = article.article_id;
    
      const category = index % 3 === 0 ? 'Football' : index % 3 === 1 ? 'Premier League' : 'Transfer News';

      html += `
        <div class="news-card">
          <div class="news-card-image">
            <img src="${imageUrl}" alt="${title}" onerror="this.src='/90minut/frontend/assets/img/blog/blog-2.jpg'">
            <div class="news-card-badge">${category}</div>
          </div>
          <div class="news-card-content">
            <h3 class="news-card-title">
              <a href="#article?id=${articleId}">
                ${title}
              </a>
            </h3>
            <p class="news-card-excerpt">${excerpt}</p>
            <div class="news-card-meta">
              <span><i class="fa fa-calendar"></i> ${date}</span>
              <span><i class="fa fa-comment"></i> ${commentCount}</span>
            </div>
          </div>
        </div>
      `;
    });
    
    container.html(html);
  },

  formatDate: function(dateString) {
    if (!dateString || dateString === '0000-00-00 00:00:00') {
      return 'N/A';
    }
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
};