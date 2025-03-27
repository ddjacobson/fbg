package com.ddj.fbg.response;

import java.util.List;
import java.util.Map;

import com.ddj.fbg.model.Game;
import com.ddj.fbg.model.League;
import com.ddj.fbg.model.Player;
import com.ddj.fbg.model.Team;

public class CreateLeagueResponseObject {
    private List<Team> teams;
    private League league;
    private Map<Integer, List<Game>> leagueSchedule;
    private List<Player> roster;

    public CreateLeagueResponseObject(List<Team> teams, League league, Map<Integer, List<Game>> leagueSchedule, List<Player> roster) {
        this.leagueSchedule = leagueSchedule;
        this.teams = teams;
        this.league = league;
        this.roster = roster;
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

    public Map<Integer, List<Game>> getLeagueSchedule() {
        return leagueSchedule;
    }
    public void setLeagueSchedule(Map<Integer, List<Game>> leagueSchedule) {
        this.leagueSchedule = leagueSchedule;
    }

    public List<Player> getRoster() {
        return roster;
    }

    public void setRoster(List<Player> roster) {
        this.roster = roster;
    }
}
