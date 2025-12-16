<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/UserDao.php';

class UserService extends BaseService {
   
    private const VALID_ROLES = ['user', 'editor', 'admin'];

    public function __construct() {
        $dao = new UserDao();
        parent::__construct($dao);
    }

    public function getAll() {
        $users = $this->dao->getAll();
        
        foreach($users as &$user) {
            unset($user['password_hash']);
        }
        
        return $users;
    }

    public function getById($id) {
        $user = $this->dao->getById($id);
        unset($user['password_hash']);
        return $user;
    }

    public function getByEmail($email) {
        $user = $this->dao->getByEmail($email);
        unset($user['password_hash']);
        return $user;
    }

    public function getByUsername($username) {
        $user = $this->dao->getByUsername($username);
        unset($user['password_hash']);
        if (!$user) {
        throw new Exception("User with username '$username' not found.");
        }
        return $user;
    }

    public function getByRole($role) {
        $users = $this->dao->getByRole($role);
        
        foreach($users as &$user) {
            unset($user['password_hash']);
        }
        
        return $users;
    }

     public function createUser($data) {

        $existingUsername = $this->dao->getByUsername($data['username']);
        $existingEmail = $this->dao->getByEmail($data['email']);
        if($existingUsername || $existingEmail){
            throw new Exception('User already exists wth these credentials.');
        }

        $password = $data['password_hash'];
        if (empty($data['username'])) {
            throw new Exception('Username is required.');
        }

        if (strlen($data['username']) < 7) {
            throw new Exception('Username must be at least 7 characters long.');
        }

        if (empty($data['email'])) {
            throw new Exception('Email is required.');
        }

        if (empty($data['password_hash'])) {
            throw new Exception('Password is required.');
        }

        if (strlen($data['password_hash']) < 8) {
             throw new Exception('Password must be at least 8 characters long.');
        }     
        
        if (!preg_match('/[A-Z]/', $password)) {
            throw new Exception('Password must contain at least one uppercase letter.');
        }

        if (!preg_match('/[0-9]/', $password)) {
            throw new Exception('Password must contain at least one number.');
        }

        if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
            throw new Exception('Password must contain at least one special character.');
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format.');
        }

        if (!isset($data['role']) || !in_array($data['role'], self::VALID_ROLES)) {
            $data['role'] = 'user'; 
        }

        $data['password_hash'] = password_hash($password, PASSWORD_DEFAULT);

        return $this->create($data);
    }
    
    public function updateUser($id, $data) {
            
        $user = $this->dao->getById($id);
        if (!$user) {
            throw new Exception('User not found.');
        }

        if (isset($data['username'])) {
            if (strlen($data['username']) < 7) {
                throw new Exception('Username must be at least 7 characters long.');
            }
        }

        if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format.');
        }

        return $this->update($id, $data);
    }

    public function deleteUser($id) {
        $user = $this->dao->getById($id);
        if (!$user) {
            throw new Exception('User not found.');
        }
        
        return $this->delete($id);
    }
/*  za milestone 4-5 cu implementirati ovu funkciju u skladu sa potrebama 
    public function updatePassword($userId, $oldPassword, $newPassword) {}
*/

public function getSelf() {
    $currentUser = Flight::get('user');

    $user = $this->dao->getById($currentUser->user_id);
    if (!$user) {
        throw new Exception("User not found");
    }

    unset($user['password_hash']);
    return $user;
}
public function updateSelf($data) {
    $currentUser = Flight::get('user');

    if (isset($data['username']) && strlen($data['username']) < 7) {
        throw new Exception("Username must be at least 7 characters");
    }

    if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    unset($data['role']); // user ne smije dirati rolu

    return $this->update($currentUser->user_id, $data);
}

}
?>