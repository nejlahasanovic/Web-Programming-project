<?php
require_once __DIR__ . '/../../config.php';
class BaseDao {
    protected $table;
    protected $connection;

    public function __construct($table) {
        $this->table = $table;
        $this->connect();
    }

    private function connect() {
        try {
            $host = Config::DB_HOST();
            $port = Config::DB_PORT();
            $dbname = Config::DB_NAME();
            $user = Config::DB_USER();
            $password = Config::DB_PASSWORD();

            $this->connection = new PDO(
                "mysql:host=$host;port=$port;dbname=$dbname",
                $user,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }

    public function getAll() {
        $stmt = $this->connection->prepare("SELECT * FROM " . $this->table);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $id_column = rtrim($this->table, 's') . '_id';
        $stmt = $this->connection->prepare("SELECT * FROM " . $this->table . " WHERE $id_column = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function insert($data) {
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        $sql = "INSERT INTO " . $this->table . " ($columns) VALUES ($placeholders)";
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute($data);
    }

    public function update($id, $data) {
        $fields = "";
        foreach ($data as $key => $value) {
            $fields .= "$key = :$key, ";
        }
        $fields = rtrim($fields, ", ");
        $id_column = rtrim($this->table, 's') . '_id';
        $sql = "UPDATE " . $this->table . " SET $fields WHERE $id_column = :id";
        $stmt = $this->connection->prepare($sql);
        $data['id'] = $id;
        return $stmt->execute($data);
    }

    public function delete($id) {
        $id_column = rtrim($this->table, 's') . '_id';
        $stmt = $this->connection->prepare("DELETE FROM " . $this->table . " WHERE $id_column = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    protected function query($sql, $params = []) {
        $stmt = $this->connection->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    protected function query_unique($sql, $params = []) {
        $stmt = $this->connection->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch();
    }
}
?>