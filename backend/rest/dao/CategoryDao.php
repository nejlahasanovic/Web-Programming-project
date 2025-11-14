<?php
require_once 'BaseDao.php';

class CategoryDao extends BaseDao {
    public function __construct() {
        parent::__construct("categories");
    }

    public function getCategoryWithArticlesCount($category_id) {
        $stmt = $this->connection->prepare("
            SELECT c.*, COUNT(a.article_id) as articles_count 
            FROM categories c 
            LEFT JOIN articles a ON c.category_id = a.category_id 
            WHERE c.category_id = :category_id 
            GROUP BY c.category_id
        ");
        $stmt->bindParam(':category_id', $category_id);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function getAllCategoriesWithCount() {
        $stmt = $this->connection->prepare("
            SELECT c.*, COUNT(a.article_id) as articles_count 
            FROM categories c 
            LEFT JOIN articles a ON c.category_id = a.category_id 
            GROUP BY c.category_id 
            ORDER BY c.category_name ASC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>