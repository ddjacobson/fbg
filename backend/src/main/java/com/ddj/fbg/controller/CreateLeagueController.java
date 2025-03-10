package com.ddj.fbg.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ddj.fbg.model.League;
import com.ddj.fbg.model.Team;
import com.ddj.fbg.repository.TeamRepository;
import com.ddj.fbg.request.league.LeagueCreateRequest;
import com.ddj.fbg.response.CreateLeagueResponseObject;
import com.ddj.fbg.service.LeagueAdminService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class CreateLeagueController {

    @Autowired TeamRepository teamRepository;
    @Autowired LeagueAdminService leagueAdminService;

    @PostMapping("/create-league")
    public CreateLeagueResponseObject createLeague(@RequestBody LeagueCreateRequest request) {
        System.out.println("Creating League with name: " + request.getLeagueName());
        CreateLeagueResponseObject responseObject = leagueAdminService.createLeague(populateLeague(request.getLeagueName(), request.getLeagueKey()));
        return responseObject;
    }

    @GetMapping("/load-league")
    public League loadLeague(@RequestBody LeagueCreateRequest request) {
        System.out.println("Loading League with key: " + request.getLeagueKey());
        // Handle league loading logic here
        return leagueAdminService.loadLeague(request.getLeagueKey());
    }

    @GetMapping("/api/get-teams")
    public void getTeams() {
        List<Team> teams = teamRepository.findAll();
        System.out.println(teams.get(0).getCity());
    }

    private League populateLeague(String leagueName, String leagueKey) {
        League l = new League();
        l.setLeagueName(leagueName);
        l.setLeagueKey(leagueKey);
        l.setWeek("1");
        l.setYear("2025");
        
        return l;
    }
    
    
    
}
