package com.ddj.fbg.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ddj.fbg.model.Team;

public interface TeamRepository extends MongoRepository<Team, String> {

  public Team findByTeamId(String teamId);

  public List<Team> findByLeagueId(String leagueId);



} 
    

