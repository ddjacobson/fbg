package com.ddj.fbg.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from any origin
// Allow requests from any origin
public class ScheduleController {

    @PostMapping("/getScheduleById")
    public String getScheduleById(@RequestParam("teamId") String id) {
        System.out.println("Retrieving schedule for team ID: " + id);
        // Logic to retrieve schedule by ID
        return "Schedule for ID: " + id;
    }
    
}
