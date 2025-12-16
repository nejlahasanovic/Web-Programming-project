<?php
require_once 'BaseDao.php';


class UserDao extends BaseDao {
   public function __construct() {
       parent::__construct("users");
   }
   
   //getbyusername dodana naknadno 
   public function getByUsername($username) {
    $stmt = $this->connection->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    $user = $stmt->fetch();

    if ($user) {
        return $user;  
    } else {
        return null;  
    }
}

   public function getByEmail($email) {
       $stmt = $this->connection->prepare("SELECT * FROM users WHERE email = :email");
       $stmt->bindParam(':email', $email);
       $stmt->execute();
       return $stmt->fetch();
   }

    public function getByRole($role) {
        $stmt = $this->connection->prepare("SELECT * FROM users WHERE role = :role ORDER BY created_at DESC");
        $stmt->bindParam(':role', $role);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>
