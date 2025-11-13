<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/TeamDao.php';

class TeamService extends BaseService {
    public function __construct() {
        $dao = new TeamDao();
        parent::__construct($dao);
    }
    
    public function getByLeagueId($league_id) {
        return $this->dao->getByLeagueId($league_id);
    }
    
    public function searchTeams($keyword) {
        return $this->dao->searchTeams($keyword);
    }
    
    public function createTeam($data) {
        if (empty($data['team_name'])) {
            throw new Exception('Team name is required.');
        }
        
        return $this->create($data);
    }
}
?>