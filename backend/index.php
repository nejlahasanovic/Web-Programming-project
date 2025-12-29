<?php
// CORS Configuration - MUST BE FIRST
$allowedOrigins = [
    getenv('FRONTEND_URL') ?: 'http://localhost/90minut/frontend',  
    'https://seal-app-rt82q.ondigitalocean.app'  
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Max-Age: 86400");
header("Access-Control-Allow-Headers: content-type, Content-Type, Authorization, Authentication, Accept, Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Handle OPTIONS preflight - respond and exit immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Content-Length: 0");
    header("Content-Type: text/plain");
    http_response_code(204);
    exit(0);
}

require __DIR__ . '/vendor/autoload.php';

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/data/roles.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';

require_once __DIR__ . '/rest/services/AuthService.php';
require_once __DIR__ . '/rest/services/UserService.php';
require_once __DIR__ . '/rest/services/ArticleService.php';
require_once __DIR__ . '/rest/services/CommentService.php';
require_once __DIR__ . '/rest/services/TeamService.php';
require_once __DIR__ . '/rest/services/LeagueService.php';
require_once __DIR__ . '/rest/services/CategoryService.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

Flight::register('userService', 'UserService');
Flight::register('articleService', 'ArticleService');
Flight::register('commentService', 'CommentService');
Flight::register('teamService', 'TeamService');
Flight::register('leagueService', 'LeagueService');
Flight::register('categoryService', 'CategoryService');
Flight::register('auth_service', "AuthService");
Flight::register('auth_middleware', 'AuthMiddleware');

Flight::before('start', function() {
    $method = Flight::request()->method;
   if (
       (
           strpos(Flight::request()->url, '/auth/login') === 0 ||
           strpos(Flight::request()->url, '/auth/register') === 0 ||
           (strpos(Flight::request()->url, '/articles') === 0 && $method === 'GET') ||
           (strpos(Flight::request()->url, '/categories') === 0 && $method === 'GET') ||
           (strpos(Flight::request()->url, '/comments') === 0 && $method === 'GET') || 
           (strpos(Flight::request()->url, '/leagues') === 0 && $method === 'GET') || 
           (strpos(Flight::request()->url, '/teams') === 0 && $method === 'GET')
       )
   ) {
       return TRUE;
   } else {
       try {
           $token = Flight::request()->getHeader("Authentication");
           if(Flight::auth_middleware()->verifyToken($token))
               return TRUE;
       } catch (\Exception $e) {
           Flight::halt(401, $e->getMessage());
       }
   }
});

require_once __DIR__ . '/rest/routes/AuthRoutes.php';
require_once __DIR__ . '/rest/routes/UserRoutes.php';
require_once __DIR__ . '/rest/routes/ArticleRoutes.php';
require_once __DIR__ . '/rest/routes/CommentRoutes.php';
require_once __DIR__ . '/rest/routes/TeamRoutes.php';
require_once __DIR__ . '/rest/routes/LeagueRoutes.php';
require_once __DIR__ . '/rest/routes/CategoryRoutes.php';

Flight::start();
?>