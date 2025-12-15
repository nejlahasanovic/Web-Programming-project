<?php
require_once 'BaseDao.php';

class ArticleDao extends BaseDao {
    public function __construct() {
        parent::__construct("articles");
    }

    public function getByAuthorId($author_id) {
        $stmt = $this->connection->prepare("SELECT * FROM articles WHERE author_id = :author_id ORDER BY published_at DESC");
        $stmt->bindParam(':author_id', $author_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getByCategoryId($category_id) {
        $stmt = $this->connection->prepare("SELECT * FROM articles WHERE category_id = :category_id ORDER BY published_at DESC");
        $stmt->bindParam(':category_id', $category_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getByLeagueId($league_id) {
        $stmt = $this->connection->prepare("SELECT * FROM articles WHERE league_id = :league_id ORDER BY published_at DESC");
        $stmt->bindParam(':league_id', $league_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getLatestArticles($limit = 10) {
        $stmt = $this->connection->prepare("SELECT * FROM articles ORDER BY published_at DESC LIMIT :limit");
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function searchArticles($keyword) {
        $searchTerm = "%$keyword%";
        $stmt = $this->connection->prepare("SELECT * FROM articles WHERE title LIKE :keyword OR content LIKE :keyword ORDER BY published_at DESC");
        $stmt->bindParam(':keyword', $searchTerm);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getArticlesByDateRange($start_date, $end_date) {
        $stmt = $this->connection->prepare("SELECT * FROM articles WHERE published_at BETWEEN :start_date AND :end_date ORDER BY published_at DESC");
        $stmt->bindParam(':start_date', $start_date);
        $stmt->bindParam(':end_date', $end_date);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getArticlesWithCommentCount() {
        $stmt = $this->connection->prepare("
            SELECT a.*, 
                   COUNT(c.comment_id) as comment_count
            FROM articles a
            LEFT JOIN comments c ON a.article_id = c.article_id
            GROUP BY a.article_id
            ORDER BY a.published_at DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

}
?>