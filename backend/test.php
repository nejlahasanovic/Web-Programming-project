<?php
require_once 'dao/UserDao.php';
require_once 'dao/LeagueDao.php';
require_once 'dao/TeamDao.php';
require_once 'dao/CategoryDao.php';
require_once 'dao/ArticleDao.php';
require_once 'dao/CommentDao.php';

$userDao = new UserDao();
$leagueDao = new LeagueDao();
$teamDao = new TeamDao();
$categoryDao = new CategoryDao();
$articleDao = new ArticleDao();
$commentDao = new CommentDao();

$userDao->insert([
    'username' => 'admin_user',
    'email' => 'admin@90minut.com',
    'password_hash' => password_hash('admin123', PASSWORD_DEFAULT),
    'role' => 'admin'
]);

$userDao->insert([
    'username' => 'editor_john',
    'email' => 'john@90minut.com',
    'password_hash' => password_hash('editor123', PASSWORD_DEFAULT),
    'role' => 'editor'
]);

$userDao->insert([
    'username' => 'fan_mike',
    'email' => 'mike@example.com',
    'password_hash' => password_hash('user123', PASSWORD_DEFAULT),
    'role' => 'user'
]);

$leagueDao->insert([
    'league_name' => 'Premier League',
    'country' => 'England'
]);

$leagueDao->insert([
    'league_name' => 'La Liga',
    'country' => 'Spain'
]);

$teamDao->insert([
    'team_name' => 'Manchester United',
    'league_id' => 1,
    'founded_year' => 1878
]);

$teamDao->insert([
    'team_name' => 'Real Madrid',
    'league_id' => 2,
    'founded_year' => 1902
]);

$categoryDao->insert([
    'category_name' => 'Match Reports'
]);

$categoryDao->insert([
    'category_name' => 'Transfer News'
]);

$articleDao->insert([
    'title' => 'Manchester United Wins 3-1',
    'content' => 'Manchester United dominated the match with a convincing 3-1 victory.',
    'author_id' => 2,
    'category_id' => 1,
    'league_id' => 1
]);

$articleDao->insert([
    'title' => 'Real Madrid Signs New Player',
    'content' => 'Real Madrid announced the signing of a promising young midfielder.',
    'author_id' => 2,
    'category_id' => 2,
    'league_id' => 2
]);

$commentDao->insert([
    'article_id' => 1,
    'user_id' => 3,
    'content' => 'Great match! United played brilliantly!'
]);

$commentDao->insert([
    'article_id' => 1,
    'user_id' => 3,
    'content' => 'Liverpool needs to improve their defense.'
]);

$users = $userDao->getAll();
print_r($users);

$articles = $articleDao->getAll();
print_r($articles);

$user = $userDao->getByEmail('admin@90minut.com');
print_r($user);

$authorArticles = $articleDao->getByAuthorId(2);
print_r($authorArticles);

$latestArticles = $articleDao->getLatestArticles(5);
print_r($latestArticles);

$searchResults = $articleDao->searchArticles('Manchester');
print_r($searchResults);

// Get comments by article
$articleComments = $commentDao->getByArticleId(1);
print_r($articleComments);

$commentCount = $commentDao->countCommentsByArticleId(1);
print_r($commentCount);

$premierTeams = $teamDao->getByLeagueId(1);
print_r($premierTeams);

$spanishLeagues = $leagueDao->getLeaguesByCountry('Spain');
print_r($spanishLeagues);

$articleDao->update(1, [
    'title' => 'Manchester United Dominates 3-1'
]);

$updatedArticle = $articleDao->getById(1);
print_r($updatedArticle);

$commentDao->delete(2);

$remainingComments = $commentDao->getAll();
print_r($remainingComments);

echo "\nAll tests are completed successfully.\n";
?>