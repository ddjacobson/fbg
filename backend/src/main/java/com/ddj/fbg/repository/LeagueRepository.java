package com.ddj.fbg.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ddj.fbg.model.League;

public interface LeagueRepository extends MongoRepository<League, String> {
 
    /**
     * Note: League is one collection in MongoDB for EVERY league... same with team (team will be indexed by leagueId for quick retrival)
     *       Players, games, will be in shared collections across all leagues, also indexed by leagueId (compound?)... to scale we will want to shard on leagueId
     *       Players will also be indexed by teamId
     *       Games will be indexed by teamId as well
     *       
     * @param leagueKey
     * @return
     */

    League findByLeagueKey(String leagueKey);
}
