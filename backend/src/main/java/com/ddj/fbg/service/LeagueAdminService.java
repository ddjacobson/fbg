package com.ddj.fbg.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ddj.fbg.model.Game;
import com.ddj.fbg.model.League;
import com.ddj.fbg.model.Player;
import com.ddj.fbg.model.Team;
import com.ddj.fbg.repository.GameRepository;
import com.ddj.fbg.repository.LeagueRepository;
import com.ddj.fbg.response.CreateLeagueResponseObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class LeagueAdminService {
    private static final String PLAYERS_PATH = "backend/src/main/resources/static/nfl_roster.json";
    
    @Autowired
    private GameRepository gameRepository;
    
    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private ScheduleGeneratorService generator;

    // @Autowired
    // private TeamRepository teamRepository;

    public CreateLeagueResponseObject createLeague(League league) {
        leagueRepository.save(league);

        CreateLeagueResponseObject response = populateLeague(league);

        return response;
    }

    public League loadLeague(String leagueKey) {
        return leagueRepository.findByLeagueKey(leagueKey);
    }

    private CreateLeagueResponseObject populateLeague(League league) {
        // generate teams and write to db
        List<Team> teams = loadTeams(league);

        // generate schedule and write to db
        Map<Integer, List<Game>> schedule = generator.generateWeeklySchedule(teams);

        // generate players and write to db
        List<Player> roster = loadPlayers(league);

        return new CreateLeagueResponseObject(teams, league, schedule, roster);
        
    }

    private List<Player> loadPlayers(League league) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Player> roster = new ArrayList<>();
        try {
            // Read the JSON file
            JsonNode rootNode = objectMapper.readTree(new File(PLAYERS_PATH));
            JsonNode playersArray = rootNode.get("players");

            // Iterate through the players array
            for (JsonNode playerNode : playersArray) {
                String name = playerNode.get("name").asText();
                String teamName = playerNode.get("team").asText();
                String position = playerNode.get("pos").asText();
                String school = playerNode.get("college").asText();
                int jerseyNo = playerNode.get("jersey").asInt();
                int speedRtg = playerNode.get("speed").asInt();
                int accelerationRtg = playerNode.get("accel").asInt();
                int agilityRtg = playerNode.get("agility").asInt();
                int strengthRtg = playerNode.get("strength").asInt();
                int injuryRtg = playerNode.get("injury").asInt();
                int jumpingRtg = playerNode.get("jumping").asInt();
                JsonNode hJsonNode = playerNode.get("height");
                if (hJsonNode == null)
                    continue;
                
                double height =hJsonNode.asDouble();
                int weight = playerNode.get("weight").asInt();
                String headshotUrl = playerNode.get("headshotUrl").asText();

                // Create a Player object
                Player player = new Player();
                player.setName(name);
                player.setPosition(position);
                player.setJerseyNo(jerseyNo);
                player.setSpeedRtg(speedRtg);
                player.setStrengthRtg(strengthRtg);
                player.setAgilityRtg(agilityRtg);
                player.setAccelerationRtg(accelerationRtg);
                player.setInjuryRtg(injuryRtg);
                player.setJumpingRtg(jumpingRtg);
                player.setTeamName(teamName); 
                player.setLeagueId(league.getLeagueId());
                player.setCollege(school);
                player.setHeadshotUrl(school);
                player.setWeight(weight);
                player.setHeight(height);
                player.setHeadshotUrl(headshotUrl);

                // Save the player to the database (if PlayerRepository is available)
                roster.add(player);
                // playerRepository.save(player);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return roster;
    }

    /**
     * Get the complete schedule for a league
     * @param leagueId The ID of the league to get the schedule for
     * @return A map of week numbers to lists of games for that week
     */
    public Map<Integer, List<Game>> getLeagueSchedule(String leagueId) {
        List<Game> allGames = gameRepository.findByLeagueId(leagueId);
        Map<Integer, List<Game>> scheduleByWeek = new java.util.HashMap<>();
        
        for (Game game : allGames) {
            int week = game.getWeek();
            if (!scheduleByWeek.containsKey(week)) {
                scheduleByWeek.put(week, new ArrayList<>());
            }
            scheduleByWeek.get(week).add(game);
        }
        
        return scheduleByWeek;
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
