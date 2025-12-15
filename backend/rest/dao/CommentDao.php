<?php
require_once 'BaseDao.php';

class CommentDao extends BaseDao {
    public function __construct() {
        parent::__construct("comments");
    }

    public function getByArticleId($article_id) {
        $stmt = $this->connection->prepare("SELECT c.*, u.username FROM comments c LEFT JOIN users u ON c.user_id = u.user_id WHERE c.article_id = :article_id ORDER BY c.created_at DESC");
        $stmt->bindParam(':article_id', $article_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getByUserId($user_id) {
        $stmt = $this->connection->prepare("SELECT * FROM comments WHERE user_id = :user_id ORDER BY created_at DESC");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getLatestCommentsByArticleId($article_id, $limit = 5) {
        $stmt = $this->connection->prepare("SELECT * FROM comments WHERE article_id = :article_id ORDER BY created_at DESC LIMIT :limit");
        $stmt->bindParam(':article_id', $article_id);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function countCommentsByArticleId($article_id) {
        $stmt = $this->connection->prepare("SELECT COUNT(*) as total FROM comments WHERE article_id = :article_id");
        $stmt->bindParam(':article_id', $article_id);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result['total'];
    }
}
?>