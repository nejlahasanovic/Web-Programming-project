<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/CommentDao.php';
require_once __DIR__ . '/../dao/UserDao.php';

class CommentService extends BaseService {
    private $userDao;
    
    public function __construct() {
        $dao = new CommentDao();
        parent::__construct($dao);
        $this->userDao = new UserDao();
    }
    
    public function getByArticleId($article_id) {
        return $this->dao->getByArticleId($article_id);
    }
    
    public function getByUserId($user_id) {
        return $this->dao->getByUserId($user_id);
    }
    
    public function getLatestCommentsByArticleId($article_id, $limit = 5) {
        return $this->dao->getLatestCommentsByArticleId($article_id, $limit);
    }
    
    public function countCommentsByArticleId($article_id) {
        return $this->dao->countCommentsByArticleId($article_id);
    }
    
    public function createComment($data) {

    if (empty($data['user_id'])) {
        throw new Exception('You must be logged in to comment.');
    }
    
    $user = $this->userDao->getById($data['user_id']);
    if (!$user) {
        throw new Exception('User not found.');
    }
    
    if (empty($data['article_id'])) {
        throw new Exception('Article ID is required.');
    }
    
    if (empty($data['content'])) {
        throw new Exception('Content is required.');
    }

     if (strlen($data['content']) < 10) {
        throw new Exception('Comment must be at least 10 characters.');
    }
    
    if (strlen($data['content']) > 1000) {
        throw new Exception('Comment cannot exceed 1000 characters.');
    }
    
    return $this->dao->insert($data);
    
}
     public function deleteComment($commentId, $data) {

        $comment = $this->dao->getById($commentId);

        if (!$comment) {
            Flight::halt(404, "Comment not found");
        }

        if ($loggedUser->role !== Roles::ADMIN && $comment['user_id'] != $loggedUser->id) {
            Flight::halt(403, "You can only delete your own comment");
        }

        return $this->dao->delete($commentId);
        }

}
?>