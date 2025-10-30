<?php
require_once 'BaseDao.php';

class TeamDao extends BaseDao {
    public function __construct() {
        parent::__construct("teams");
    }

    public function getByLeagueId($league_id) {
        $stmt = $this->connection->prepare("SELECT * FROM teams WHERE league_id = :league_id ORDER BY team_name ASC");
        $stmt->bindParam(':league_id', $league_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function searchTeams($keyword) {
        $searchTerm = "%$keyword%";
        $stmt = $this->connection->prepare("SELECT * FROM teams WHERE team_name LIKE :keyword ORDER BY team_name ASC");
        $stmt->bindParam(':keyword', $searchTerm);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>