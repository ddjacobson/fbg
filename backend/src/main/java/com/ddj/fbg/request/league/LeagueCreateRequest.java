package com.ddj.fbg.request.league;

public class LeagueCreateRequest {

    private String leagueName;
    private String leagueKey;
    
    public String getLeagueKey() {
        return leagueKey;
    }

    public void setLeagueKey(String leagueKey) {
        this.leagueKey = leagueKey;
    }

    // Getter and Setter
    public String getLeagueName() {
        return leagueName;
    }

    public void setLeagueName(String leagueName) {
        this.leagueName = leagueName;
    }
}
