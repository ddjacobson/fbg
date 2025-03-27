package com.ddj.fbg.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

import com.ddj.fbg.model.Game;

public interface GameRepository extends MongoRepository<Game, String> {
    List<Game> findByLeagueId(String leagueId);
}
