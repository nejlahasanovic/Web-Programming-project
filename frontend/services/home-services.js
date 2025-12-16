let HomeService = {
  
  init: function() {
    
    HomeService.loadTrendingNews();

    HomeService.loadSoccerFeed();

    HomeService.loadLatestNews();

    HomeService.loadPopularPosts();
    
    HomeService.setupLatestNewsFilter();
  },

  loadTrendingNews: function() {
   
    RestClient.get('articles/with-comments?limit=3', 
      function(response) {
        const articles = Array.isArray(response) ? response : (response.data || []);
        
        let html = '';
        articles.slice(0, 3).forEach(function(article) {
          html += `<div class="nt-item">${article.title}</div>`;
        });
        
        $('#trending-news-slider').html(html);
        
        if (typeof $.fn.owlCarousel !== 'undefined') {
          $('#trending-news-slider').owlCarousel({
            loop: true,
            margin: 0,
            items: 1,
            dots: false,
            nav: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            smartSpeed: 1200,
            autoHeight: false,
            autoplay: true,
          });
        }
      },
      function(error) {
        console.error("Error loading trending news:", error);
      }
    );
  },


  loadSoccerFeed: function() {
   
    RestClient.get('articles/with-comments?limit=4',
      function(response) {
        const articles = Array.isArray(response) ? response : (response.data || []);
        
        let html = '';
        articles.slice(0, 4).forEach(function(article) {
          const imageUrl = article.image_url || '/90minut/frontend/assets/img/soccer/soccer-1.jpg';
          
          const date = HomeService.formatDate(article.published_at);
        
          const commentCount = article.comment_count || 0;
          
          html += `
            <div class="col-lg-3 col-sm-6 p-0">
              <div class="soccer-item set-bg" data-setbg="${imageUrl}">
                <div class="si-tag">Soccer</div>
                <div class="si-text">
                  <h5><a href="#article?id=${article.article_id}">${article.title}</a></h5>
                  <ul>
                    <li><i class="fa fa-calendar"></i> ${date}</li>
                    <li><i class="fa fa-edit"></i> ${commentCount} Comments</li>
                  </ul>
                </div>
              </div>
            </div>
          `;
        });
        
        $('#soccer-feed').html(html);
     
        $('.set-bg').each(function() {
          var bg = $(this).data('setbg');
          $(this).css('background-image', 'url(' + bg + ')');
        });
      },
      function(error) {
        console.error("Error loading soccer feed:", error);
      }
    );
  },


  loadLatestNews: function(categoryId = null) {
   
    let url = 'articles/with-comments?limit=5';
    if (categoryId && categoryId !== 'all') {
      url += '&category_id=' + categoryId;
    }
    
    RestClient.get(url, 
      function(response) {
        const articles = Array.isArray(response) ? response : (response.data || []);
        
        if (articles.length === 0) {
          $('#latest-news-container').html('<p>No articles found.</p>');
          return;
        }
        
        let html = '';
        
        const bigArticle = articles[0];
        const bigImageUrl = bigArticle.image_url || '/90minut/frontend/assets/img/news/latest-b.jpg';
        
        const bigDate = HomeService.formatDate(bigArticle.published_at);
        
        const bigCommentCount = bigArticle.comment_count || 0;
        
        const excerpt = bigArticle.content ? bigArticle.content.substring(0, 150) + '...' : '';
        
        html += `
          <div class="col-md-6">
            <div class="news-item left-news">
              <div class="ni-pic set-bg" data-setbg="${bigImageUrl}">
                <div class="ni-tag">Soccer</div>
              </div>
              <div class="ni-text">
                <h4><a href="#article?id=${bigArticle.article_id}">${bigArticle.title}</a></h4>
                <ul>
                  <li><i class="fa fa-calendar"></i> ${bigDate}</li>
                  <li><i class="fa fa-edit"></i> ${bigCommentCount} Comments</li>
                </ul>
                <p>${excerpt}</p>
              </div>
            </div>
          </div>
        `;
        
        html += '<div class="col-md-6">';
        articles.slice(1, 5).forEach(function(article) {
          const imageUrl = article.image_url || '/90minut/frontend/assets/img/news/ln-1.jpg';
          
          const date = HomeService.formatDate(article.published_at);
          
          const commentCount = article.comment_count || 0;
          
          html += `
            <div class="news-item">
              <div class="ni-pic">
                <img src="${imageUrl}" alt="${article.title}">
              </div>
              <div class="ni-text">
                <h5><a href="#article?id=${article.article_id}">${article.title}</a></h5>
                <ul>
                  <li><i class="fa fa-calendar"></i> ${date}</li>
                  <li><i class="fa fa-edit"></i> ${commentCount} Comments</li>
                </ul>
              </div>
            </div>
          `;
        });
        html += '</div>';
        
        $('#latest-news-container').html(html);

        $('.set-bg').each(function() {
          var bg = $(this).data('setbg');
          $(this).css('background-image', 'url(' + bg + ')');
        });
      },
      function(error) {
        console.error("Error loading latest news:", error);
      }
    );
  },

  loadPopularPosts: function() {

    RestClient.get('articles/with-comments?limit=8', 
      function(response) {
        const articles = Array.isArray(response) ? response : (response.data || []);
        
        let leftColumn = '';
        let rightColumn = '';

        articles.slice(0, 4).forEach(function(article, index) {
          const imageUrl = article.image_url || '/90minut/frontend/assets/img/news/ln-1.jpg';

          const date = HomeService.formatDate(article.published_at);

          const commentCount = article.comment_count || 0;
          
          if (index === 0) {
      
            leftColumn += `
              <div class="news-item popular-item set-bg" data-setbg="${imageUrl}">
                <div class="ni-tag tenis">Transfer</div>
                <div class="ni-text">
                  <h5><a href="#article?id=${article.article_id}">${article.title}</a></h5>
                  <ul>
                    <li><i class="fa fa-calendar"></i> ${date}</li>
                    <li><i class="fa fa-edit"></i> ${commentCount} Comments</li>
                  </ul>
                </div>
              </div>
            `;
          } else {

            leftColumn += `
              <div class="news-item">
                <div class="ni-pic">
                  <img src="${imageUrl}" alt="${article.title}">
                </div>
                <div class="ni-text">
                  <h5><a href="#article?id=${article.article_id}">${article.title}</a></h5>
                  <ul>
                    <li><i class="fa fa-calendar"></i> ${date}</li>
                    <li><i class="fa fa-edit"></i> ${commentCount} Comments</li>
                  </ul>
                </div>
              </div>
            `;
          }
        });
        

        articles.slice(4, 8).forEach(function(article, index) {
          const imageUrl = article.image_url || '/90minut/frontend/assets/img/news/ln-5.jpg';
          
          const date = HomeService.formatDate(article.published_at);
          
          const commentCount = article.comment_count || 0;
          
          if (index === 0) {
            rightColumn += `
              <div class="news-item popular-item set-bg" data-setbg="${imageUrl}">
                <div class="ni-tag football">Football</div>
                <div class="ni-text">
                  <h5><a href="#article?id=${article.article_id}">${article.title}</a></h5>
                  <ul>
                    <li><i class="fa fa-calendar"></i> ${date}</li>
                    <li><i class="fa fa-edit"></i> ${commentCount} Comments</li>
                  </ul>
                </div>
              </div>
            `;
          } else {
            rightColumn += `
              <div class="news-item">
                <div class="ni-pic">
                  <img src="${imageUrl}" alt="${article.title}">
                </div>
                <div class="ni-text">
                  <h5><a href="#article?id=${article.article_id}">${article.title}</a></h5>
                  <ul>
                    <li><i class="fa fa-calendar"></i> ${date}</li>
                    <li><i class="fa fa-edit"></i> ${commentCount} Comments</li>
                  </ul>
                </div>
              </div>
            `;
          }
        });
        
        let html = `
          <div class="col-md-6">${leftColumn}</div>
          <div class="col-md-6">${rightColumn}</div>
        `;
        
        $('#popular-posts-container').html(html);
        
        $('.set-bg').each(function() {
          var bg = $(this).data('setbg');
          $(this).css('background-image', 'url(' + bg + ')');
        });
      },
      function(error) {
        console.error("Error loading popular posts:", error);
      }
    );
  },

  setupLatestNewsFilter: function() {
    $(document).off('click', '.latest-title ul li').on('click', '.latest-title ul li', function() {
      
      $('.latest-title ul li').removeClass('active');
      
      $(this).addClass('active');
      
      const filter = $(this).data('filter');

      HomeService.loadLatestNews(filter);
    });
  },

  formatDate: function(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
};