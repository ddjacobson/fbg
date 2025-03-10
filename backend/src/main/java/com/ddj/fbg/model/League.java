package com.ddj.fbg.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "leagues")
public class League {
    
    @Id
    private String leagueId;
    private String leagueName;
    private String leagueKey;
    private String year;
    private String week;

    public String getYear() {
        return year;
    }
    public void setYear(String year) {
        this.year = year;
    }
    public String getWeek() {
        return week;
    }
    public void setWeek(String week) {
        this.week = week;
    }
    
    public String getLeagueId() {
        return leagueId;
    }
    public void setLeagueId(String leagueId) {
        this.leagueId = leagueId;
    }
    public String getLeagueName() {
        return leagueName;
    }
    public void setLeagueName(String leagueName) {
        this.leagueName = leagueName;
    }
    public String getLeagueKey() {
        return leagueKey;
    }
    public void setLeagueKey(String leagueKey) {
        this.leagueKey = leagueKey;
    }
}
