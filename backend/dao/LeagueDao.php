<?php
require_once 'BaseDao.php';

class LeagueDao extends BaseDao {
    public function __construct() {
        parent::__construct("leagues");
    }

    public function getLeaguesByCountry($country) {
        $stmt = $this->connection->prepare("SELECT * FROM leagues WHERE country = :country ORDER BY league_name ASC");
        $stmt->bindParam(':country', $country);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getLeagueWithTeamsCount($league_id) {
        $stmt = $this->connection->prepare("
            SELECT l.*, COUNT(t.team_id) as teams_count 
            FROM leagues l 
            LEFT JOIN teams t ON l.league_id = t.league_id 
            WHERE l.league_id = :league_id 
            GROUP BY l.league_id
        ");
        $stmt->bindParam(':league_id', $league_id);
        $stmt->execute();
        return $stmt->fetch();
    }
}
?>