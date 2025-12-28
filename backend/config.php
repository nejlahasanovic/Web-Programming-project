<?php
// Set the reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL ^ (E_NOTICE | E_DEPRECATED));

class Config
{
    public static function DB_NAME()
    {
        return Config::get_env("DB_NAME", '90minut');
    }

    public static function DB_PORT()
    {
        return Config::get_env("DB_PORT", 3306);
    }

    public static function DB_USER()
    {
        return Config::get_env("DB_USER", 'root');
    }

    public static function DB_PASSWORD()
    {
        return Config::get_env("DB_PASSWORD", 'Nekaca05*');
    }

    public static function DB_HOST()
    {
        return Config::get_env("DB_HOST", 'localhost');
    }

    public static function JWT_SECRET()
    {
        return Config::get_env("JWT_SECRET", 'vJ+8fxajix9QnsxoV8ZLDYU9kh3QETPTXbob2XwvucrK+WarO3ljP1aHnmD1KQlz');
    }

    public static function get_env($name, $default)
    {
        $value = getenv($name);
        
        // DEBUG OUTPUT
        error_log("ENV $name = " . ($value !== false ? $value : "NOT SET (using default: $default)"));
        
        return $value !== false && trim($value) != "" ? $value : $default;
    }
}

class Database {
    private static $connection = null;

    public static function connect() {
        if (self::$connection === null) {
            try {
                $host = Config::DB_HOST();
                $port = Config::DB_PORT();
                $dbname = Config::DB_NAME();
                $user = Config::DB_USER();
                
                error_log("Connecting to: host=$host port=$port dbname=$dbname user=$user");
                
                self::$connection = new PDO(
                    "mysql:host=$host;port=$port;dbname=$dbname",
                    $user,
                    Config::DB_PASSWORD(),
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]
                );
                
                error_log("Database connection successful!");
                
            } catch (PDOException $e) {
                error_log("Database connection failed: " . $e->getMessage());
                die("Connection failed: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}
?>