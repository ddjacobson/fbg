package com.ddj.fbg.model.stats;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;

@Document(collection = "season_stats")
public class SeasonStats {
    @Id
    private String id;
    private String playerId;
    private String teamId;
    private String leagueId;
    private int season;
    private int gamesPlayed;
    private Map<String, Number> stats;

    public SeasonStats(String playerId, String teamId, String leagueId, int season, int gamesPlayed, Map<String, Number> stats) {
        this.playerId = playerId;
        this.teamId = teamId;
        this.leagueId = leagueId;
        this.season = season;
        this.gamesPlayed = gamesPlayed;
        this.stats = stats;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public String getLeagueId() {
        return leagueId;
    }

    public void setLeagueId(String leagueId) {
        this.leagueId = leagueId;
    }

    public int getSeason() {
        return season;
    }

    public void setSeason(int season) {
        this.season = season;
    }

    public int getGamesPlayed() {
        return gamesPlayed;
    }

    public void setGamesPlayed(int gamesPlayed) {
        this.gamesPlayed = gamesPlayed;
    }

    public Map<String, Number> getStats() {
        return stats;
    }

    public void setStats(Map<String, Number> stats) {
        this.stats = stats;
    }

}