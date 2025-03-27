package com.ddj.fbg.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ddj.fbg.model.Game;
import com.ddj.fbg.service.LeagueAdminService;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from any origin
// Allow requests from any origin
public class ScheduleController {

    @Autowired
    private LeagueAdminService leagueAdminService;

    @PostMapping("/getScheduleById")
    public String getScheduleById(@RequestParam("teamId") String id) {
        System.out.println("Retrieving schedule for team ID: " + id);
        // Logic to retrieve schedule by ID
        return "Schedule for ID: " + id;
    }
    
    @GetMapping("/api/league/schedule/{leagueId}")
    public Map<Integer, List<Game>> getLeagueSchedule(@PathVariable("leagueId") String leagueId) {
        System.out.println("Retrieving schedule for league ID: " + leagueId);
        return leagueAdminService.getLeagueSchedule(leagueId);
    }
    
    // Add an alternative endpoint that follows Spring MVC conventions
    @GetMapping("/league/schedule/{leagueId}")
    public Map<Integer, List<Game>> getLeagueScheduleAlt(@PathVariable("leagueId") String leagueId) {
        System.out.println("Retrieving schedule for league ID (alt): " + leagueId);
        return leagueAdminService.getLeagueSchedule(leagueId);
    }
}
