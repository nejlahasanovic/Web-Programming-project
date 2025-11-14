<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/CategoryDao.php';

class CategoryService extends BaseService {
    public function __construct() {
        $dao = new CategoryDao();
        parent::__construct($dao);
    }
    
    public function getCategoryWithArticlesCount($category_id) {
        return $this->dao->getCategoryWithArticlesCount($category_id);
    }
    
    public function getAllCategoriesWithCount() {
        return $this->dao->getAllCategoriesWithCount();
    }
    
    public function createCategory($data) {
        if (empty($data['category_name'])) {
            throw new Exception('Category name is required.');
        }
        
        return $this->create($data);
    }
}
?>
