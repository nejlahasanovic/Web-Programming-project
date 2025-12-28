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
        return isset($_ENV[$name]) && trim($_ENV[$name]) != "" ? $_ENV[$name] : $default;
    }
}

class Database {
    private static $connection = null;

    public static function connect() {
        if (self::$connection === null) {
            try {
                self::$connection = new PDO(
                    "mysql:host=" . Config::DB_HOST() . ";dbname=" . Config::DB_NAME(),
                    Config::DB_USER(),
                    Config::DB_PASSWORD(),
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]
                );
            } catch (PDOException $e) {
                die("Connection failed: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}
?>