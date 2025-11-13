<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/LeagueDao.php';

class LeagueService extends BaseService {
    public function __construct() {
        $dao = new LeagueDao();
        parent::__construct($dao);
    }
    
    public function getLeaguesByCountry($country) {
        return $this->dao->getLeaguesByCountry($country);
    }
    
    public function getLeagueWithTeamsCount($league_id) {
        return $this->dao->getLeagueWithTeamsCount($league_id);
    }

    public function createLeague($data) {
     
        if (empty($data['league_name'])) {
            throw new Exception('League name is required.');
        }
        
        return $this->create($data);
    }
}
?>