<?php
// Set the reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL ^ (E_NOTICE | E_DEPRECATED));

class Config {
    public static function DB_NAME() {
        return Config::get_env("DB_NAME", '90minut');
    }

    public static function DB_PORT() {
        return Config::get_env("DB_PORT", 3306);
    }

    public static function DB_USER() {
        return Config::get_env("DB_USER", 'root');
    }

    public static function DB_PASSWORD() {
        return Config::get_env("DB_PASSWORD", 'Nekaca05*');
    }

    public static function DB_HOST() {
        return Config::get_env("DB_HOST", "127.0.0.1");
    }

    public static function JWT_SECRET() {
        return Config::get_env("JWT_SECRET", 'vJ+8fxajix9QnsxoV8ZLDYU9kh3QETPTXbob2XwvucrK+WarO3ljP1aHnmD1KQlz');
    }

   public static function get_env($name, $default) {
    $value = getenv($name);
    return ($value !== false && trim($value) !== "") ? $value : $default;
}

}
?>