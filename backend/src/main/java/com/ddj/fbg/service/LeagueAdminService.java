package com.ddj.fbg.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ddj.fbg.model.League;
import com.ddj.fbg.model.Team;
import com.ddj.fbg.repository.LeagueRepository;
import com.ddj.fbg.repository.TeamRepository;
import com.ddj.fbg.response.CreateLeagueResponseObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class LeagueAdminService {
    
    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private ScheduleGeneratorService generator;

    @Autowired
    private TeamRepository teamRepository;

    public CreateLeagueResponseObject createLeague(League league) {
        leagueRepository.save(league);

        List<Team> teams = populateLeague(league);
        // need to add teams to league, and add players to teams

        CreateLeagueResponseObject response = new CreateLeagueResponseObject(teams, league);

        return response;

    }

    public League loadLeague(String leagueKey) {
        return leagueRepository.findByLeagueKey(leagueKey);
    }

    private List<Team> populateLeague(League league) {
        // generate teams and write to db
        List<Team> teams = loadTeams(league);

        // generate schedule and write to db
        
        generator.generateWeeklySchedule(teams);

        // generate players and write to db
        // loadPlayers(league);

        return teams;
        
    }

    private List<Team> loadTeams(League league) {
        ObjectMapper objectMapper = new ObjectMapper();
        ArrayList<Team> teams = new ArrayList<>(32);
        try {

            JsonNode rootNode = objectMapper.readTree(new File("backend/src/main/resources/static/nfl_teams.json"));
            JsonNode teamsArray = rootNode.get("teams");

            for (JsonNode team : teamsArray) {

                String city = team.get("city").asText();
                String name = team.get("name").asText();
                String conf = team.get("conf").asText();
                String division = team.get("division").asText();
                int prevYearRnk = Integer.parseInt(team.get("previousYearRank").asText());
                
                Team t = new Team();
                t.setTeamId(UUID.randomUUID().toString());
                t.setLeagueId(league.getLeagueId());
                t.setCity(city);
                t.setName(name);
                t.setConf(conf);
                t.setDivision(division);
                t.setPreviousYearRank(prevYearRnk);
                teams.add(t);
                // teamRepository.save(t);
        }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return teams;
    }

}
