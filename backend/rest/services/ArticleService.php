<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/ArticleDao.php';
require_once __DIR__ . '/../dao/UserDao.php';

class ArticleService extends BaseService {
    private $userDao;

    public function __construct() {
        $dao = new ArticleDao();
        parent::__construct($dao);
        $this->userDao = new UserDao();
    }

    public function getByAuthorId($author_id) {
        return $this->dao->getByAuthorId($author_id);
    }

    public function getByCategoryId($category_id) {
        return $this->dao->getByCategoryId($category_id);
    }

    public function getByLeagueId($league_id) {
        return $this->dao->getByLeagueId($league_id);
    }

    public function getLatestArticles($limit = 10) {
        return $this->dao->getLatestArticles($limit);
    }

    public function searchArticles($keyword) {
        return $this->dao->searchArticles($keyword);
    }

    public function getArticlesByDateRange($start_date, $end_date) {
        return $this->dao->getArticlesByDateRange($start_date, $end_date);
    }
    public function getArticlesWithCommentCount() {
    return $this->dao->getArticlesWithCommentCount();
}
    
    public function createArticle($data) {

        if (empty($data['title'])) {
            throw new Exception('Title is required.');
        }

        if (empty($data['content'])) {
            throw new Exception('Content is required.');
        }

        if (empty($data['author_id'])) {
            throw new Exception('Author ID is required.');
        }

        if (strlen($data['content']) < 20) {
            throw new Exception('Article content must be at least 20 characters.');
        }

        return $this->create($data);
    }

    public function updateArticle($id, $data) {

        $article = $this->dao->getById($id);
        if (!$article) {
            throw new Exception('Article not found.');
        }

        if (!empty($data['title']) && strlen($data['title']) < 3) {
            throw new Exception('Title must be at least 3 characters.');
        }

        if (!empty($data['content']) && strlen($data['content']) < 20) {
            throw new Exception('Content must be at least 20 characters.');
        }

        return $this->update($id, $data); 
    }

    public function deleteArticle($id) {
        
        $article = $this->dao->getById($id);
        if (!$article) {
            throw new Exception('Article not found.');
        }

        return $this->delete($id); 
    }

}
?>
