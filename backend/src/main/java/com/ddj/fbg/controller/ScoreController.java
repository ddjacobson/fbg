package com.ddj.fbg.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class ScoreController {

    @GetMapping("/api/getAllScores")
    public String getAllScores() { 
        System.out.println("Running controller");
        return "score";
    }
    
    
}
