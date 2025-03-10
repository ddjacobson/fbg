package com.ddj.fbg.response;

import java.util.List;

import com.ddj.fbg.model.League;
import com.ddj.fbg.model.Team;

public class CreateLeagueResponseObject {
    List<Team> teams;
    League league;

    public CreateLeagueResponseObject(List<Team> teams, League league) {
        this.teams = teams;
        this.league = league;
    }
    public List<Team> getTeams() {
        return teams;
    }
    public void setTeams(List<Team> teams) {
        this.teams = teams;
    }
    public League getLeague() {
        return league;
    }
    public void setLeague(League league) {
        this.league = league;
    }
}
