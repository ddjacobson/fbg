package com.ddj.fbg.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "teams")
public class Team {

    @Id
    private String teamId;

    @Indexed
    private String leagueId;

    private String city;
    private String name;
    private String conf;
    private String division;
    private int wins;
    private int losses;
    private int ties;
    private String logoUrl;
    private boolean isUserTeam;

    private int previousYearRank;

    public Team(String teamId, String leagueId, String city, String name, String conf, String division, int wins, int losses, int ties, String logoUrl, boolean isUserTeam, int previousYearRank) {
        this.teamId = teamId;
        this.leagueId = leagueId;
        this.city = city;
        this.name = name;
        this.conf = conf;
        this.division = division;
        this.wins = wins;
        this.losses = losses;
        this.ties = ties;
        this.logoUrl = logoUrl;
        this.isUserTeam = isUserTeam;
        this.previousYearRank = previousYearRank;
    }

    public Team() {

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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getConf() {
        return conf;
    }

    public void setConf(String conf) {
        this.conf = conf;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getLosses() {
        return losses;
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }

    public int getTies() {
        return ties;
    }

    public void setTies(int ties) {
        this.ties = ties;
    }

    public int getPreviousYearRank() {
        return previousYearRank;
    }

    public void setPreviousYearRank(int previousYearRank) {
        this.previousYearRank = previousYearRank;
    }

    public boolean isUserTeam() {
        return isUserTeam;
    }

    public void setUserTeam(boolean userTeam) {
        isUserTeam = userTeam;
    }



    @Override
    public String toString() {
        return  String.format("%s, %s", city, name);
    }

    @Override
    public boolean equals(Object obj) {
        return  ((Team) obj).getName().equals(this.name);
    }

    public boolean isSameConf(Team t) {
        return t.getConf().equals(this.conf);
    }

    public boolean isSameDivison(Team t) {
        return t.getDivision().equals(this.division) && isSameConf(t);
    }

}
