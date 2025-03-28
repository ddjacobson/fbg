package com.ddj.fbg.model;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "players")
@CompoundIndexes({
    @CompoundIndex(name = "teamId_leagueId", def = "{'teamId': 1, 'leagueId': 1}")
})
public class Player {

    @Id
    private String playerId;

    @Indexed
    private String teamId;

    @Indexed 
    private String leagueId;

    private String name;
    private String position;
    private String teamName;
    private int jerseyNo;
    private int speedRtg;
    private int strengthRtg;
    private int agilityRtg;
    private int accelerationRtg;
    private int injuryRtg;
    private int jumpingRtg;
    private int age;
    private double height;
    private int weight;
    private String college;
    private String exp;
    
    private String headshotUrl; 

    public Player(String name, String position, int age, double height, int weight, String college, String exp, String logoUrl, String teamName) {
        this.setPlayerId(UUID.randomUUID().toString());
        this.name = name;
        this.position = position;
        this.age = age;
        this.height = height;
        this.weight = weight;
        this.college = college;
    }

    public Player() {
        this.setPlayerId(UUID.randomUUID().toString());
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getHeadshotUrl() {
        return headshotUrl;
    }

    public void setHeadshotUrl(String headshotUrl) {
        this.headshotUrl = headshotUrl;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getLeagueId() {
        return leagueId;
    }

    public void setLeagueId(String leagueId) {
        this.leagueId = leagueId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getExp() {
        return exp;
    }

    public void setExp(String exp) {
        this.exp = exp;
    }

    public int getJerseyNo() {
        return jerseyNo;
    }
    
    public void setJerseyNo(int jerseyNo) {
        this.jerseyNo = jerseyNo;
    }
    
    public int getSpeedRtg() {
        return speedRtg;
    }
    
    public void setSpeedRtg(int speedRtg) {
        this.speedRtg = speedRtg;
    }
    
    public int getStrengthRtg() {
        return strengthRtg;
    }
    
    public void setStrengthRtg(int strengthRtg) {
        this.strengthRtg = strengthRtg;
    }
    
    public int getAgilityRtg() {
        return agilityRtg;
    }
    
    public void setAgilityRtg(int agilityRtg) {
        this.agilityRtg = agilityRtg;
    }
    
    public int getAccelerationRtg() {
        return accelerationRtg;
    }
    
    public void setAccelerationRtg(int accelerationRtg) {
        this.accelerationRtg = accelerationRtg;
    }
    
    public int getInjuryRtg() {
        return injuryRtg;
    }
    
    public void setInjuryRtg(int injuryRtg) {
        this.injuryRtg = injuryRtg;
    }
    
    public int getJumpingRtg() {
        return jumpingRtg;
    }
    
    public void setJumpingRtg(int jumpingRtg) {
        this.jumpingRtg = jumpingRtg;
    }
}
