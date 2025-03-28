package com.ddj.fbg.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ddj.fbg.request.team.SetUserTeamRequest;
import com.ddj.fbg.service.LeagueAdminService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserTeamController {
    
    @Autowired LeagueAdminService leagueAdminService;

    @PostMapping("/set-user-team")
    public void setUserTeam(@RequestBody SetUserTeamRequest request) {
        // Given a teamId, set the team as the user's team
        leagueAdminService.setUserTeam(request.getTeamId());
    }

}
