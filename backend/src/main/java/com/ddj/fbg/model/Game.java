package com.ddj.fbg.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "games")
@CompoundIndexes({
    @CompoundIndex(name = "gameId_leagueId", def = "{'gameId': 1, 'leagueId': 1}")
})
public class Game {

    @Id
    private String gameId;

    @Indexed
    private String leagueId;

    Team homeTeam;
    Team awayTeam;
    int week;
    int year;

    // Constructor
    public Game(String gameId, String leagueId, Team homeTeam, Team awayTeam, int week, int year) {
        this.gameId = gameId;
        this.leagueId = leagueId;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.week = week;
        this.year = year;
    }

    public Game(Team homeTeam, Team awayTeam, int week, int year) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.week = week;
        this.year = year;
    }

    // Getters and Setters
    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getLeagueId() {
        return leagueId;
    }

    public void setLeagueId(String leagueId) {
        this.leagueId = leagueId;
    }

    public Team getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(Team homeTeam) {
        this.homeTeam = homeTeam;
    }

    public Team getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(Team awayTeam) {
        this.awayTeam = awayTeam;
    }

    public int getWeek() {
        return week;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }


}
