package com.ddj.fbg.request.team;

public class SetUserTeamRequest {
    private String teamId;

    public SetUserTeamRequest() {
    }

    public SetUserTeamRequest(String teamId) {
        this.teamId = teamId;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }
}
