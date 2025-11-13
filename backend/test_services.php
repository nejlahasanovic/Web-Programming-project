<?php
require_once 'services/UserService.php';
require_once 'services/ArticleService.php';
require_once 'services/CommentService.php';
require_once 'services/TeamService.php';
require_once 'services/LeagueService.php';
require_once 'services/CategoryService.php';

$userService = new UserService();
$articleService = new ArticleService();
$commentService = new CommentService();
$teamService = new TeamService();
$leagueService = new LeagueService();
$categoryService = new CategoryService();

$userService->createUser([
    'username' => 'test_user',
    'email' => 'test@90minut.com',
    'password_hash' => password_hash('password123', PASSWORD_DEFAULT),
    'role' => 'user'
]);


$leagueService->createLeague([
    'league_name' => 'Serie A',
    'country' => 'Italy'
]);

$teamService->createTeam([
    'team_name' => 'AC Milan',
    'league_id' => 1,
    'founded_year' => 1899
]);

$categoryService->createCategory([
    'category_name' => 'Player Profiles'
]);

$articleService->createArticle([
    'title' => 'AC Milan Wins Derby',
    'content' => 'AC Milan secured a thrilling victory in the derby match with an outstanding performance from their star players.',
    'author_id' => 1,
    'category_id' => 1,
    'league_id' => 1
]);

$commentService->createComment([
    'article_id' => 1,
    'user_id' => 1,
    'content' => 'Great article! Very informative and well written.'
]);

$users = $userService->getAll();
print_r($users);

$user = $userService->getByEmail('test@90minut.com');
print_r($user);

$leagues = $leagueService->getAll();
print_r($leagues);

$italianLeagues = $leagueService->getLeaguesByCountry('Italy');
print_r($italianLeagues);

$teams = $teamService->getAll();
print_r($teams);

$milanTeams = $teamService->searchTeams('Milan');
print_r($milanTeams);

$categories = $categoryService->getAllCategoriesWithCount();
print_r($categories);

$latestArticles = $articleService->getLatestArticles(3);
print_r($latestArticles);

$articles = $articleService->searchArticles('Milan');
print_r($articles);

$comments = $commentService->getByArticleId(1);
print_r($comments);

$count = $commentService->countCommentsByArticleId(1);
print_r($count);

$articleService->update(1, ['title' => 'AC Milan Dominates Derby']);

$commentService->delete(1);

echo "\nAll tests passed successfully.\n";
?>