package com.ddj.fbg.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ddj.fbg.model.Player;
import java.util.List;

public interface PlayerRepository extends MongoRepository<Player, String> {

    List<Player> findByLeagueId(String leagueId);
    
}
