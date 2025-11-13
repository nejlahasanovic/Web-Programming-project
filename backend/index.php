<?php
require __DIR__ . '/vendor/autoload.php';

require_once __DIR__ . '/rest/services/UserService.php';
require_once __DIR__ . '/rest/services/ArticleService.php';
require_once __DIR__ . '/rest/services/CommentService.php';
require_once __DIR__ . '/rest/services/TeamService.php';
require_once __DIR__ . '/rest/services/LeagueService.php';
require_once __DIR__ . '/rest/services/CategoryService.php';

Flight::register('userService', 'UserService');
Flight::register('articleService', 'ArticleService');
Flight::register('commentService', 'CommentService');
Flight::register('teamService', 'TeamService');
Flight::register('leagueService', 'LeagueService');
Flight::register('categoryService', 'CategoryService');

require_once __DIR__ . '/rest/routes/UserRoutes.php';
require_once __DIR__ . '/rest/routes/ArticleRoutes.php';
require_once __DIR__ . '/rest/routes/CommentRoutes.php';
require_once __DIR__ . '/rest/routes/TeamRoutes.php';
require_once __DIR__ . '/rest/routes/LeagueRoutes.php';
require_once __DIR__ . '/rest/routes/CategoryRoutes.php';

Flight::start();
?>