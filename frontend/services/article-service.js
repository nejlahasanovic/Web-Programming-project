let ArticleService = {

  init: function () {

    $("#add-article-form").validate({
      submitHandler: function (form) {
        var article = Object.fromEntries(new FormData(form).entries());
      
        article.category_id = parseInt(article.category_id, 10);
        article.author_id = parseInt(article.author_id, 10);
        article.league_id = parseInt(article.league_id, 10);
  
        
        ArticleService.addArticle(article);
        form.reset();
      },
    });

    $("#edit-article-form").validate({
      submitHandler: function (form) {
        var article = Object.fromEntries(new FormData(form).entries());
        
        article.category_id = parseInt(article.category_id, 10);
        article.author_id = parseInt(article.author_id, 10);
        article.league_id = parseInt(article.league_id, 10);
        
        
        ArticleService.editArticle(article);
      },
    });

    ArticleService.getAllArticles();
  },


  openAddModal: function () {
    $('#addArticleModal').modal('show');
  },

 
  addArticle: function (article) {
    $.blockUI({ message: '<h3>Processing...</h3>' });
    
    RestClient.post('articles', article, 
      function(response) {
        toastr.success("Article added successfully!");
        $.unblockUI();
        ArticleService.getAllArticles();
        ArticleService.closeModal();
      }, 
      function(jqXHR) {
        $.unblockUI();
        ArticleService.closeModal();
        toastr.error(jqXHR.responseText || "Error adding article");
      }
    );
  },

  getAllArticles: function () {
    RestClient.get("articles", 
      function(response) {
       
        const data = Array.isArray(response) ? response : (response.data || []);
        
        ArticleService.updateStats(data);
       
        Utils.datatable('articles-table', [
          { 
            data: null,
            title: '<input type="checkbox" id="selectAll">',
            orderable: false,
            width: '30px',
            render: function() {
              return '<input type="checkbox" class="row-checkbox">';
            }
          },
          { 
            data: 'title', 
            title: 'Title',
            render: function(data, type, row) {
              return `
                <div class="article-title-cell">
                  <div class="article-title-text">
                    <strong>${data}</strong>
                    <span class="article-excerpt">${row.content ? row.content.substring(0, 50) + '...' : ''}</span>
                  </div>
                </div>
              `;
            }
          },
          { 
            data: 'category_id', 
            title: 'Category',
            render: function(data) {
              const categories = {
                1: 'News', 2: 'Match Report', 3: 'Transfer', 4: 'Interview'
              };
              const categoryName = categories[data] || 'Unknown';
              return `<span class="badge badge-primary">${categoryName}</span>`;
            }
          },
          { 
            data: 'author_id', 
            title: 'Author',
            render: function(data) {
              return `Admin User #${data}`;
            }
          },
          { 
            data: 'published_at', 
            title: 'Status',
            render: function(data) {
              if (data == 1) {
                return '<span class="status-badge status-published"><i class="fa fa-check-circle"></i> Published</span>';
              } else {
                return '<span class="status-badge status-draft"><i class="fa fa-edit"></i> Draft</span>';
              }
            }
          },
          { 
            data: 'league_id', 
            title: 'League',
            render: function(data) {
              return `League #${data}`;
            }
          },
         
          {
            title: 'Actions',
            orderable: false,
            render: function (data, type, row) {
              
              const rowStr = encodeURIComponent(JSON.stringify(row));
              
              return `
                <div class="action-buttons">
                  <button class="btn-icon btn-edit" title="Edit" onclick="ArticleService.openEditModal('${row.article_id}')">
                    <i class="fa fa-edit"></i>
                  </button>
                  <button class="btn-icon btn-view" title="View" onclick="ArticleService.openViewMore('${row.article_id}')">
                    <i class="fa fa-eye"></i>
                  </button>
                  <button class="btn-icon btn-delete" title="Delete" onclick="ArticleService.openConfirmationDialog(decodeURIComponent('${rowStr}'))">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              `;
            }
          }
        ], data, 10);
      }, 
      function(jqXHR) {
        toastr.error(jqXHR.responseText || "Cannot load articles");
      }
    );
  },

  updateStats: function(articles) {
    const total = articles.length;
    const published = articles.filter(a => a.published_at == 1).length;
    const drafts = articles.filter(a => a.published_at == 0).length;
    
    $('#totalArticles').text(total);
    $('#publishedArticles').text(published);
    $('#draftArticles').text(drafts);
    $('#totalViews').text('0');
  },

  getArticleById: function(id) {
    $.blockUI({ message: '<h3>Loading...</h3>' });
    
    RestClient.get('articles/' + id, 
      function(data) {
      
        $('#edit-article-form input[name="article_id"]').val(data.article_id);
        $('#edit-article-form input[name="title"]').val(data.title);
        $('#edit-article-form textarea[name="content"]').val(data.content);
        $('#edit-article-form input[name="category_id"]').val(data.category_id);
        $('#edit-article-form input[name="author_id"]').val(data.author_id);
        $('#edit-article-form input[name="league_id"]').val(data.league_id);
        $('#edit-article-form input[name="published_at"]').prop('checked', data.published_at == 1);
        
        $.unblockUI();
      }, 
      function(jqXHR) {
        $.unblockUI();
        toastr.error('Error fetching article');
      }
    );
  },

  openViewMore: function(id) {
      window.location.hash = '#article?id=' + id;
  },

 
  openEditModal: function(id) {
    $.blockUI({ message: '<h3>Processing...</h3>' });
    $('#editArticleModal').modal('show');
    ArticleService.getArticleById(id);
  },

  closeModal: function() {
    $('#addArticleModal').modal('hide');
    $('#editArticleModal').modal('hide');
    $('#deleteArticleModal').modal('hide');
  },

  editArticle: function(article) {
    $.blockUI({ message: '<h3>Processing...</h3>' });
    
    RestClient.patch('articles/' + article.article_id, article, 
      function(data) {
        $.unblockUI();
        toastr.success("Article updated successfully!");
        ArticleService.closeModal();
        ArticleService.getAllArticles();
      }, 
      function(jqXHR) {
        $.unblockUI();
        toastr.error(jqXHR.responseText || 'Error updating article');
      }
    );
  },

  openConfirmationDialog: function(article) {
    article = JSON.parse(article);
    
    $("#deleteArticleModal").modal("show");
    $("#delete-article-body").html(
      "Do you want to delete article: <strong>" + article.title + "</strong>?"
    );
    $("#delete_article_id").val(article.article_id);
  },

  deleteArticle: function() {
    const id = $("#delete_article_id").val();
    
    RestClient.delete('articles/' + id, null, 
      function(response) {
        ArticleService.closeModal();
        toastr.success("Article deleted successfully!");
        ArticleService.getAllArticles();
      }, 
      function(jqXHR) {
        ArticleService.closeModal();
        toastr.error(jqXHR.responseText || "Error deleting article");
      }
    );
  }
};