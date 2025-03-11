package com.ddj.fbg.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ddj.fbg.model.Game;
import com.ddj.fbg.model.Team;

@Service
public class ScheduleGeneratorService {
    
    private static final int TOTAL_WEEKS = 18;
    private static final int BYE_WEEK_MIN = 4;
    private static final int BYE_WEEK_MAX = 14;
    private static final int currentYear = 2024; // TODO: change to league year
    private List<Team> teams;
    private Map<String, String> interConferencePairings = new HashMap<>();

    // private final int currentYear;
    private final Random random = new Random();

    public ScheduleGeneratorService(List<Team> teams) {
        this.teams = teams;
    }

    public Map<Integer, List<Game>> generateWeeklySchedule(List<Team> teams) {
        this.teams = teams;
        
        // Generate all possible matchups according to NFL rules
        List<Game> allGames = generateAllMatchups();
        
        // Verify we have exactly the right number of games (272 for NFL)
        int expectedGames = (teams.size() * 17) / 2; // Each team plays 17 games, divided by 2 because each game counts for 2 teams
        System.out.println("Generated " + allGames.size() + " games, expecting " + expectedGames);
        
        if (allGames.size() != expectedGames) {
            System.err.println("WARNING: Number of games generated (" + allGames.size() + 
                             ") does not match expected (" + expectedGames + "). Check matchup generation logic.");
        }
        
        // Assign bye weeks to each team
        Map<Team, Integer> byeWeeks = assignByeWeeks();
        
        // Print bye week assignments for debugging
        System.out.println("\nBye Week Assignments:");
        for (Team team : teams) {
            System.out.println(team.getName() + ": Week " + byeWeeks.get(team));
        }
        
        // Initialize weekly schedule
        Map<Integer, List<Game>> weeklySchedule = new TreeMap<>();
        for (int week = 1; week <= TOTAL_WEEKS; week++) {
            weeklySchedule.put(week, new ArrayList<>());
        }
        
        // IMPROVED SCHEDULING APPROACH: Graph coloring algorithm
        System.out.println("\nUsing constraint-based scheduling to ensure proper distribution:");
        
        // 1. Build a map of game availability by week
        Map<Game, Set<Integer>> gameAvailableWeeks = new HashMap<>();
        
        // Pre-calculate available weeks for each game based on bye weeks
        for (Game game : allGames) {
            Team homeTeam = game.getHomeTeam();
            Team awayTeam = game.getAwayTeam();
            
            Set<Integer> availableWeeks = new HashSet<>();
            for (int week = 1; week <= TOTAL_WEEKS; week++) {
                // Skip weeks where either team has a bye
                if (week == byeWeeks.get(homeTeam) || week == byeWeeks.get(awayTeam)) {
                    continue;
                }
                availableWeeks.add(week);
            }
            
            gameAvailableWeeks.put(game, availableWeeks);
        }
        
        // 2. Sort games by constraint level (fewest available weeks first)
        List<Game> sortedGames = new ArrayList<>(allGames);
        sortedGames.sort((g1, g2) -> {
            // First, prioritize division games
            boolean isDivG1 = areDivisionRivals(g1.getHomeTeam(), g1.getAwayTeam());
            boolean isDivG2 = areDivisionRivals(g2.getHomeTeam(), g2.getAwayTeam());
            if (isDivG1 && !isDivG2) return -1;
            if (!isDivG1 && isDivG2) return 1;
            
            // Then, sort by available weeks (most constrained first)
            return Integer.compare(
                gameAvailableWeeks.get(g1).size(),
                gameAvailableWeeks.get(g2).size()
            );
        });
        
        // 3. Track which weeks each team is already playing
        Map<Team, Set<Integer>> teamScheduledWeeks = new HashMap<>();
        for (Team team : teams) {
            teamScheduledWeeks.put(team, new HashSet<>());
            // Add bye week as "scheduled"
            teamScheduledWeeks.get(team).add(byeWeeks.get(team));
        }
        
        // 4. Schedule games using constraint propagation
        List<Game> successfullyScheduled = new ArrayList<>();
        List<Game> unscheduledGames = new ArrayList<>();
        
        for (Game game : sortedGames) {
            Team homeTeam = game.getHomeTeam();
            Team awayTeam = game.getAwayTeam();
            
            // Calculate remaining available weeks for this game
            Set<Integer> availableWeeks = new HashSet<>(gameAvailableWeeks.get(game));
            
            // Remove weeks where either team is already scheduled
            availableWeeks.removeAll(teamScheduledWeeks.get(homeTeam));
            availableWeeks.removeAll(teamScheduledWeeks.get(awayTeam));
            
            if (availableWeeks.isEmpty()) {
                unscheduledGames.add(game);
                System.out.println("CONSTRAINT FAILURE: Cannot schedule " + 
                                  awayTeam.getName() + " @ " + homeTeam.getName() + 
                                  " - No available weeks");
                continue;
            }
            
            // Find best week based on current distribution
            int bestWeek = findBestWeek(availableWeeks, weeklySchedule);
            
            // Schedule the game
            game.setWeek(bestWeek);
            weeklySchedule.get(bestWeek).add(game);
            
            // Update team schedules
            teamScheduledWeeks.get(homeTeam).add(bestWeek);
            teamScheduledWeeks.get(awayTeam).add(bestWeek);
            
            successfullyScheduled.add(game);
        }
        
        // If we have unscheduled games, we need to backtrack and reschedule
        if (!unscheduledGames.isEmpty()) {
            System.out.println("\nAttempting to resolve conflicts by rescheduling");
            
            // Sort unscheduled games by most constrained first
            unscheduledGames.sort((g1, g2) -> {
                Set<Integer> weeks1 = getPotentialWeeks(g1, teamScheduledWeeks, byeWeeks);
                Set<Integer> weeks2 = getPotentialWeeks(g2, teamScheduledWeeks, byeWeeks);
                return Integer.compare(weeks1.size(), weeks2.size());
            });
            
            for (Game game : unscheduledGames) {
                boolean scheduled = attemptRescheduleForGame(game, successfullyScheduled, weeklySchedule, 
                                                         teamScheduledWeeks, byeWeeks);
                
                if (scheduled) {
                    System.out.println("Successfully rescheduled to accommodate: " + 
                                      game.getAwayTeam().getName() + " @ " + game.getHomeTeam().getName());
                    successfullyScheduled.add(game);
                } else {
                    System.err.println("CRITICAL: Could not schedule: " + 
                                      game.getAwayTeam().getName() + " @ " + game.getHomeTeam().getName() + 
                                      " even with rescheduling");
                }
            }
        }
        
        // Verify final schedule
        int totalScheduledGames = weeklySchedule.values().stream()
            .mapToInt(List::size)
            .sum();
        
        System.out.println("\nFinal schedule contains " + totalScheduledGames + " games (expected " + expectedGames + ")");
        for (int week = 1; week <= TOTAL_WEEKS; week++) {
            System.out.println("Week " + week + ": " + weeklySchedule.get(week).size() + " games");
        }
        
        // Verify no team plays more than once per week
        boolean valid = true;
        for (int week = 1; week <= TOTAL_WEEKS; week++) {
            Set<Team> teamsThisWeek = new HashSet<>();
            List<Game> gamesThisWeek = weeklySchedule.get(week);
            
            for (Game game : gamesThisWeek) {
                Team homeTeam = game.getHomeTeam();
                Team awayTeam = game.getAwayTeam();
                
                if (teamsThisWeek.contains(homeTeam)) {
                    valid = false;
                    System.err.println("ERROR: " + homeTeam.getName() + " plays multiple games in week " + week);
                } else {
                    teamsThisWeek.add(homeTeam);
                }
                
                if (teamsThisWeek.contains(awayTeam)) {
                    valid = false;
                    System.err.println("ERROR: " + awayTeam.getName() + " plays multiple games in week " + week);
                } else {
                    teamsThisWeek.add(awayTeam);
                }
            }
        }
        
        if (valid) {
            System.out.println("\nSchedule is valid! No teams play multiple games in any week.");
        } else {
            System.err.println("\nSCHEDULE IS INVALID - See errors above");
        }
        
        // Print the full schedule
        for (int week = 1; week <= TOTAL_WEEKS; week++) {
            System.out.println("\nWeek " + week + " (" + weeklySchedule.get(week).size() + " games):");
            for (Game game : weeklySchedule.get(week)) {
                System.out.printf("  %s at %s%n", 
                    game.getAwayTeam().getName(), game.getHomeTeam().getName());
            }
        }
        
        // Verify team schedule completeness
        for (Team team : teams) {
            int gamesScheduled = 0;
            for (int week = 1; week <= TOTAL_WEEKS; week++) {
                for (Game game : weeklySchedule.get(week)) {
                    if (game.getHomeTeam().equals(team) || game.getAwayTeam().equals(team)) {
                        gamesScheduled++;
                    }
                }
            }
            
            if (gamesScheduled != 17) {
                System.err.println("ERROR: " + team.getName() + " has " + gamesScheduled + 
                                  " games scheduled. Should have exactly 17.");
            }
        }
        
        return weeklySchedule;
    }

    private List<Game> generateAllMatchups() {
        generateInterConferencePairings(); // Initialize pairings at the start
        List<Game> allMatchups = new ArrayList<>();
        
        // 1. Division games (home and away) - 6 games per team
        for (Team team : teams) {
            for (Team divisionOpponent : getDivisionOpponents(team)) {
                // Double-header division games
                allMatchups.add(new Game(team, divisionOpponent, -1, currentYear));
                allMatchups.add(new Game(divisionOpponent, team, -1, currentYear));
            }
        }
        
        // 2. Generate conference matchups with controlled home/away
        Set<String> scheduledMatchups = new HashSet<>();
        for (Team team : teams) {
            // Get 4 intra-conference opponents from the division in rotation
            List<Team> intraConferenceOpponents = getIntraConferenceOpponents(team);
            
            // Get 4 inter-conference opponents from the paired division
            List<Team> interConferenceOpponents = getInterConferenceOpponents(team);
            
            // Combined other conference matchups
            List<Team> otherOpponents = new ArrayList<>();
            otherOpponents.addAll(intraConferenceOpponents);
            otherOpponents.addAll(interConferenceOpponents);
            
            for (Team opponent : otherOpponents) {
                String key = createMatchupKey(team, opponent);
                
                if (!scheduledMatchups.contains(key)) {
                    // Alternate home/away based on year parity
                    boolean homeGame = (currentYear % 2 == 0) ^ 
                                      (team.getName().compareTo(opponent.getName()) > 0);
                    
                    allMatchups.add(homeGame ? 
                        new Game(team, opponent, -1, currentYear) : 
                        new Game(opponent, team, -1, currentYear));
                    
                    scheduledMatchups.add(key);
                }   
            }
        }
        
        // 3. Add the 17th game - based on conference standings from previous year
        for (Team team : teams) {
            if (team.getConf().equals("AFC")) {
                // Find NFC team with same standing in previous year
                Team opponent = findMatchingStandingOpponent(team);
                if (opponent != null) {
                    String key = createMatchupKey(team, opponent);
                    if (!scheduledMatchups.contains(key)) {
                        // For 17th game, AFC is home in odd years, NFC in even years
                        boolean homeGame = currentYear % 2 != 0;
                        
                        allMatchups.add(homeGame ? 
                            new Game(team, opponent, -1, currentYear) : 
                            new Game(opponent, team, -1, currentYear));
                        
                        scheduledMatchups.add(key);
                    }
                }
            }
        }
        
        // 4. Add the remaining intra-conference games based on same division finish
        // These are the 2 games against teams from the same conference with same division finish
        List<Game> sameFinishGames = generateSameFinishIntraConferenceGames();
        for (Game game : sameFinishGames) {
            String key = createMatchupKey(game.getHomeTeam(), game.getAwayTeam());
            if (!scheduledMatchups.contains(key)) {
                allMatchups.add(game);
                scheduledMatchups.add(key);
            }
        }

        // 5. Ensure all matchups are unique
        List<Game> uniqueGames = deduplicateGames(allMatchups);
        
        System.out.println("uniqueGames length: " + uniqueGames.size());
        
        // Verify each team has exactly 17 games
        verifyScheduleCompleteness(uniqueGames);
        
        return uniqueGames;
    }

    private String createMatchupKey(Team team1, Team team2) {
        // Alphabetical sorting ensures consistent key regardless of home/away
        String[] names = {team1.getName(), team2.getName()};
        Arrays.sort(names);
        return names[0] + ":" + names[1];
    }

    private List<Game> deduplicateGames(List<Game> games) {
        Set<String> seen = new HashSet<>();
        List<Game> unique = new ArrayList<>();
        
        for (Game g : games) {
            String key = g.getHomeTeam().getName() + ":" + g.getAwayTeam().getName();
            if (!seen.contains(key)) {
                unique.add(g);
                seen.add(key);
                seen.add(g.getHomeTeam().getName() + ":" + g.getAwayTeam().getName());
            } 
        }

        return unique;
    }

    private Map<Team, Integer> assignByeWeeks() {
        Map<Team, Integer> byeWeeks = new HashMap<>();
        List<Integer> availableWeeks = new ArrayList<>();
        
        for (int i = BYE_WEEK_MIN; i <= BYE_WEEK_MAX; i++) {
            availableWeeks.add(i);
        }
        Collections.shuffle(availableWeeks);
        
        int index = 0;
        for (Team team : teams) {
            if (index >= availableWeeks.size()) index = 0;
            byeWeeks.put(team, availableWeeks.get(index++));
        }
        return byeWeeks;
    }

    private int calculateIdealWeek(Game game) {
        // Prioritize division games later in season
        if (areDivisionRivals(game.getHomeTeam(), game.getAwayTeam())) {
            // Distribute division games between weeks 14-18
            // First division game usually weeks 3-6
            // Second division game usually weeks 14-18
            
            // Check if teams already played each other
            boolean alreadyPlayed = false;
            for (int w = 1; w <= 13; w++) {
                if (teamsPlayedInWeek(game.getHomeTeam(), game.getAwayTeam(), w)) {
                    alreadyPlayed = true;
                    break;
                }
            }
            
            if (alreadyPlayed) {
                return random.nextInt(5) + 14; // Weeks 14-18
            } else {
                return random.nextInt(4) + 3; // Weeks 3-6
            }
        }
        
        // Schedule other games throughout the season
        return random.nextInt(13) + 1; // Weeks 1-13
    }

    private boolean teamsPlayedInWeek(Team team1, Team team2, int week) {
        // This would need access to the weekly schedule while building
        // For simplicity, we'll always return false during initial implementation
        return false;
    }

    private boolean scheduleGameInWeek(Game game, int idealWeek, Map<Team, Integer> byeWeeks, 
                                     Map<Integer, List<Game>> weeklySchedule) {
        // Try the ideal week first
        if (isValidWeek(game, idealWeek, byeWeeks, weeklySchedule)) {
            game.setWeek(idealWeek);
            weeklySchedule.get(idealWeek).add(game);
            return true;
        }
        
        // If ideal week doesn't work, spiral outward from the ideal week
        for (int offset = 1; offset < TOTAL_WEEKS; offset++) {
            // Try week ahead
            int weekAhead = (idealWeek + offset - 1) % TOTAL_WEEKS + 1;
            if (isValidWeek(game, weekAhead, byeWeeks, weeklySchedule)) {
                game.setWeek(weekAhead);
                weeklySchedule.get(weekAhead).add(game);
                return true;
            }
            
            // Try week behind
            int weekBehind = (idealWeek - offset + TOTAL_WEEKS - 1) % TOTAL_WEEKS + 1;
            if (isValidWeek(game, weekBehind, byeWeeks, weeklySchedule)) {
                game.setWeek(weekBehind);
                weeklySchedule.get(weekBehind).add(game);
                return true;
            }
        }
        
        return false; // Could not find a valid week
    }

    private boolean isValidWeek(Game game, int week,
                               Map<Team, Integer> byeWeeks,
                               Map<Integer, List<Game>> weeklySchedule) {
        if (byeWeeks.get(game.getHomeTeam()) == week || 
            byeWeeks.get(game.getAwayTeam()) == week) {
            return false;
        }
        
        return weeklySchedule.get(week).stream()
            .noneMatch(existing -> 
                existing.getHomeTeam().equals(game.getHomeTeam()) ||
                existing.getAwayTeam().equals(game.getHomeTeam()) ||
                existing.getHomeTeam().equals(game.getAwayTeam()) ||
                existing.getAwayTeam().equals(game.getAwayTeam()));
    }

    private boolean areDivisionRivals(Team a, Team b) {
        return a.getDivision().equals(b.getDivision()) && 
               a.getConf().equals(b.getConf());
    }

    private List<Team> getDivisionOpponents(Team team) {
        List<Team> opponents = new ArrayList<>();
        for (Team t : teams) {
            if (team.isSameDivison(t) && !t.equals(team)) {
                // Home and away games
                opponents.add(t);
                opponents.add(t);
            }
        }
        return opponents;
    }

    private List<Team> getIntraConferenceOpponents(Team team) {
            List<String> conferenceDivisions = getSortedConferenceDivisions(team.getConf());
            int yearsSinceCycle = currentYear - 2023;
            int rotationIndex = yearsSinceCycle % 3;
            
            int currentDivisionIndex = conferenceDivisions.indexOf(team.getDivision());
            int targetDivisionIndex = (currentDivisionIndex + rotationIndex + 1) % conferenceDivisions.size();
            String targetDivision = conferenceDivisions.get(targetDivisionIndex);

            return teams.stream()
                .filter(t -> t.getConf().equals(team.getConf()))
                .filter(t -> t.getDivision().equals(targetDivision))
                .collect(Collectors.toList());
    }

    private List<String> getSortedConferenceDivisions(String conference) {
        return teams.stream()
            .filter(t -> t.getConf().equals(conference))
            .map(t -> t.getDivision())
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }   

    private List<Team> getInterConferenceOpponents(Team team) {
        // Calculate pairings once per schedule generation
        if (interConferencePairings.isEmpty()) {
            generateInterConferencePairings();
            System.out.println("interConferencePairings: " + interConferencePairings);
        }

        String pairedDivision = interConferencePairings.get(team.getDivision());
        return teams.stream()
            .filter(t -> t.getConf().equals(getOtherConference(team.getConf())))
            .filter(t -> t.getDivision().equals(pairedDivision))
            .collect(Collectors.toList());
    }

    private void generateInterConferencePairings() {
        List<String> ourConferenceDivs = getSortedConferenceDivisions("AFC");
        List<String> otherConferenceDivs = getSortedConferenceDivisions("NFC");
        int rotationIndex = (currentYear - 2024) % 4;

        for (int i = 0; i < ourConferenceDivs.size(); i++) {
            String ourDiv = ourConferenceDivs.get(i);
            String theirDiv = otherConferenceDivs.get((i + rotationIndex) % 4);
            interConferencePairings.put(ourDiv, theirDiv);
            interConferencePairings.put(theirDiv, ourDiv); // Ensure reciprocal pairing
        }
    }

    private String getOtherConference(String conference) {
        return teams.stream()
            .map(t -> t.getConf())
            .filter(c -> !c.equals(conference))
            .findFirst()
            .orElseThrow();
    }

    // Find team in the opposite conference with matching position from previous year
    private Team findMatchingStandingOpponent(Team team) {
        String otherConference = getOtherConference(team.getConf());
        
        // Using the NFL's formula for 17th game that's distinct from regular interconference matchups
        int yearsSince2021 = currentYear - 2021;
        int rotationIndex = yearsSince2021 % 4;
        
        // Get the team's division and position
        String teamDivision = team.getDivision();
        int positionInDivision = team.getPreviousYearRank();
        
        // For AFC, North plays West, East plays East, South plays South, West plays North
        // For 2024, the rotation is: AFC North vs NFC West, AFC East vs NFC East,
        // AFC South vs NFC South, and AFC West vs NFC North
        
        // Determine target division in other conference based on fixed pairings with rotation
        final String targetDivision;
        if (team.getConf().equals("AFC")) {
            switch (teamDivision) {
                case "North": 
                    String[] northTargets = {"West", "South", "East", "North"};
                    targetDivision = northTargets[rotationIndex];
                    break;
                case "East":
                    String[] eastTargets = {"East", "North", "West", "South"};
                    targetDivision = eastTargets[rotationIndex];
                    break;
                case "South":
                    String[] southTargets = {"South", "East", "North", "West"};
                    targetDivision = southTargets[rotationIndex];
                    break;
                case "West":
                    String[] westTargets = {"North", "West", "South", "East"};
                    targetDivision = westTargets[rotationIndex];
                    break;
                default:
                    targetDivision = "East"; // fallback
            }
        } else { // NFC
            switch (teamDivision) {
                case "North": 
                    String[] northTargets = {"West", "South", "East", "North"};
                    targetDivision = northTargets[(rotationIndex + 2) % 4]; // Offset to match AFC
                    break;
                case "East":
                    String[] eastTargets = {"East", "North", "West", "South"};
                    targetDivision = eastTargets[(rotationIndex + 2) % 4]; // Offset to match AFC
                    break;
                case "South":
                    String[] southTargets = {"South", "East", "North", "West"};
                    targetDivision = southTargets[(rotationIndex + 2) % 4]; // Offset to match AFC
                    break;
                case "West":
                    String[] westTargets = {"North", "West", "South", "East"};
                    targetDivision = westTargets[(rotationIndex + 2) % 4]; // Offset to match AFC
                    break;
                default:
                    targetDivision = "East"; // fallback
            }
        }
        
        System.out.println("Looking for 17th game opponent for " + team.getName() + 
                          " (Division: " + teamDivision + ", Rank: " + positionInDivision + 
                          ") in " + otherConference + " " + targetDivision + " division");
        
        // Find the team that matches the criteria
        List<Team> potentialOpponents = teams.stream()
            .filter(t -> t.getConf().equals(otherConference))
            .filter(t -> t.getDivision().equals(targetDivision))
            .filter(t -> t.getPreviousYearRank() == positionInDivision)
            .collect(Collectors.toList());
        
        if (potentialOpponents.isEmpty()) {
            System.err.println("Warning: No team found with matching rank in target division for " + team.getName());
            
            // Try again without rank matching as fallback
            potentialOpponents = teams.stream()
                .filter(t -> t.getConf().equals(otherConference))
                .filter(t -> t.getDivision().equals(targetDivision))
                .collect(Collectors.toList());
        }
        
        // Ensure this opponent isn't already scheduled through other rules
        List<Team> alreadyScheduledOpponents = new ArrayList<>();
        // Check for teams already scheduled through regular interconference play
        for (Game game : generateInterconferenceGames()) {
            if (game.getHomeTeam().equals(team)) {
                alreadyScheduledOpponents.add(game.getAwayTeam());
            } else if (game.getAwayTeam().equals(team)) {
                alreadyScheduledOpponents.add(game.getHomeTeam());
            }
        }
        
        potentialOpponents.removeAll(alreadyScheduledOpponents);
        
        if (potentialOpponents.isEmpty()) {
            System.err.println("All potential 17th game opponents for " + team.getName() + 
                              " are already scheduled through other rules");
            
            // As a last resort, pick any team from the other conference
            potentialOpponents = teams.stream()
                .filter(t -> t.getConf().equals(otherConference))
                .filter(t -> !alreadyScheduledOpponents.contains(t))
                .collect(Collectors.toList());
        }
        
        if (!potentialOpponents.isEmpty()) {
            // Sort by name for deterministic results
            potentialOpponents.sort((t1, t2) -> t1.getName().compareTo(t2.getName()));
            Team selected = potentialOpponents.get(0);
            System.out.println("Selected 17th game opponent for " + team.getName() + 
                              ": " + selected.getName());
            return selected;
        }
        
        System.err.println("CRITICAL: Could not find ANY 17th game opponent for " + team.getName());
        return null;
    }

    // Helper method to get just the interconference games without side effects
    private List<Game> generateInterconferenceGames() {
        List<Game> interconferenceGames = new ArrayList<>();
        Set<String> scheduledMatchups = new HashSet<>();
        
        for (Team team : teams) {
            List<Team> interConferenceOpponents = teams.stream()
                .filter(t -> !t.getConf().equals(team.getConf()))
                .filter(t -> t.getDivision().equals(interConferencePairings.get(team.getDivision())))
                .collect(Collectors.toList());
            
            for (Team opponent : interConferenceOpponents) {
                String key = createMatchupKey(team, opponent);
                if (!scheduledMatchups.contains(key)) {
                    boolean homeGame = (currentYear % 2 == 0) ^ 
                                      (team.getName().compareTo(opponent.getName()) > 0);
                    
                    interconferenceGames.add(homeGame ? 
                        new Game(team, opponent, -1, currentYear) : 
                        new Game(opponent, team, -1, currentYear));
                    
                    scheduledMatchups.add(key);
                }
            }
        }
        
        return interconferenceGames;
    }

    // Verify that each team has exactly 17 games
    private void verifyScheduleCompleteness(List<Game> games) {
        Map<Team, Integer> gameCountByTeam = new HashMap<>();
        
        // Initialize counts
        for (Team team : teams) {
            gameCountByTeam.put(team, 0);
        }
        
        // Count games for each team
        for (Game game : games) {
            gameCountByTeam.put(game.getHomeTeam(), gameCountByTeam.get(game.getHomeTeam()) + 1);
            gameCountByTeam.put(game.getAwayTeam(), gameCountByTeam.get(game.getAwayTeam()) + 1);
        }
        
        // Verify counts
        for (Team team : teams) {
            int gameCount = gameCountByTeam.get(team);
            if (gameCount != 17) {
                System.err.println("Warning: " + team.getName() + " has " + gameCount + 
                                  " games scheduled. Should have exactly 17.");
            }
        }
    }

    // Verify that each team plays exactly one game per week (except bye week)
    private void verifyTeamSchedules(Map<Integer, List<Game>> weeklySchedule, Map<Team, Integer> byeWeeks) {
        for (Team team : teams) {
            for (int week = 1; week <= TOTAL_WEEKS; week++) {
                if (week == byeWeeks.get(team)) {
                    // Should be on bye this week
                    continue;
                }
                
                int gamesThisWeek = (int) weeklySchedule.get(week).stream()
                    .filter(g -> g.getHomeTeam().equals(team) || g.getAwayTeam().equals(team))
                    .count();
                
                if (gamesThisWeek != 1) {
                    System.err.println("Warning: " + team.getName() + " plays " + 
                                      gamesThisWeek + " games in week " + week + 
                                      ". Should play exactly 1 game.");
                }
            }
        }
    }

    // Generate games between teams in the same conference that had the same divisional finish
    // but are not in the same division or the division being played in the rotation
    private List<Game> generateSameFinishIntraConferenceGames() {
        List<Game> games = new ArrayList<>();
        Set<String> scheduledMatchups = new HashSet<>();
        
        for (String conference : Arrays.asList("AFC", "NFC")) {
            // Get all divisions in this conference
            List<String> conferenceDivisions = getSortedConferenceDivisions(conference);
            
            // Calculate which division each division already plays in the rotation
            Map<String, String> divisionRotationPairing = new HashMap<>();
            int yearsSinceCycle = currentYear - 2023;
            int rotationIndex = yearsSinceCycle % 3;
            
            for (int i = 0; i < conferenceDivisions.size(); i++) {
                String division = conferenceDivisions.get(i);
                String targetDivision = conferenceDivisions.get((i + rotationIndex + 1) % conferenceDivisions.size());
                divisionRotationPairing.put(division, targetDivision);
                System.out.println(conference + " " + division + " plays " + conference + " " + targetDivision + " in rotation");
            }
            
            // For each division in the conference
            for (String division : conferenceDivisions) {
                // For each possible divisional finish (1st, 2nd, 3rd, 4th)
                for (int finishPosition = 1; finishPosition <= 4; finishPosition++) {
                    // Capture the current finish position value in a final variable
                    final int currentFinishPosition = finishPosition;
                    
                    // Find the team in this division with this finish
                    List<Team> teamsWithFinish = teams.stream()
                        .filter(t -> t.getConf().equals(conference))
                        .filter(t -> t.getDivision().equals(division))
                        .filter(t -> t.getPreviousYearRank() == currentFinishPosition)
                        .collect(Collectors.toList());
                    
                    if (teamsWithFinish.isEmpty()) {
                        System.err.println("Warning: No team found in " + conference + " " + division + 
                                          " with position " + currentFinishPosition);
                        continue;
                    }
                    
                    Team team = teamsWithFinish.get(0);
                    
                    // Find the two divisions this team doesn't play (not own division or rotation division)
                    List<String> otherDivisions = conferenceDivisions.stream()
                        .filter(d -> !d.equals(division)) // Not own division
                        .filter(d -> !d.equals(divisionRotationPairing.get(division))) // Not rotation division
                        .collect(Collectors.toList());
                    
                    System.out.println(team.getName() + " (" + division + " #" + currentFinishPosition + 
                                      ") needs to play teams with same finish from: " + otherDivisions);
                    
                    // For each of those divisions, find the team with same finish
                    for (String otherDivision : otherDivisions) {
                        List<Team> otherTeamsWithFinish = teams.stream()
                            .filter(t -> t.getConf().equals(conference))
                            .filter(t -> t.getDivision().equals(otherDivision))
                            .filter(t -> t.getPreviousYearRank() == currentFinishPosition)
                            .collect(Collectors.toList());
                        
                        if (otherTeamsWithFinish.isEmpty()) {
                            System.err.println("Warning: No team found in " + conference + " " + otherDivision + 
                                              " with position " + currentFinishPosition);
                            continue;
                        }
                        
                        Team opponent = otherTeamsWithFinish.get(0);
                        
                        // Create matchup key to check if already scheduled
                        String key = createMatchupKey(team, opponent);
                        if (!scheduledMatchups.contains(key)) {
                            // Determine home/away (alternate based on division alphabetical order for consistency)
                            boolean homeGame = division.compareTo(otherDivision) < 0;
                            if (currentYear % 2 != 0) homeGame = !homeGame; // Alternate by year
                            
                            Game game = homeGame ?
                                new Game(team, opponent, -1, currentYear) :
                                new Game(opponent, team, -1, currentYear);
                            
                            games.add(game);
                            scheduledMatchups.add(key);
                            
                            System.out.println("Scheduled: " + game.getHomeTeam().getName() + 
                                              " (home) vs " + game.getAwayTeam().getName() + 
                                              " - " + conference + " same finish game");
                        }
                    }
                }
            }
        }
        
        return games;
    }

    // New helper method to count games already scheduled for a team
    private int countScheduledGames(Team team, Map<Integer, List<Game>> weeklySchedule) {
        return (int) weeklySchedule.values().stream()
            .flatMap(List::stream)
            .filter(g -> g.getHomeTeam().equals(team) || g.getAwayTeam().equals(team))
            .count();
    }

    // New helper method to get weeks sorted by how many games are already scheduled
    private List<Integer> getWeeksSortedByAvailability(Game game, Map<Team, Integer> byeWeeks, 
                                                     Map<Integer, List<Game>> weeklySchedule) {
        Map<Integer, Integer> weekToGameCount = new HashMap<>();
        
        for (int week = 1; week <= TOTAL_WEEKS; week++) {
            // Skip bye weeks for either team
            if (week == byeWeeks.get(game.getHomeTeam()) || week == byeWeeks.get(game.getAwayTeam())) {
                continue;
            }
            
            // Count games already scheduled in this week
            weekToGameCount.put(week, weeklySchedule.get(week).size());
        }
        
        // Sort weeks by fewest games scheduled
        return weekToGameCount.entrySet().stream()
            .sorted(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    // New method for aggressive scheduling - allow conflicts but minimize them
    private boolean forceScheduleGameInWeek(Game game, int week, Map<Team, Integer> byeWeeks, 
                                          Map<Integer, List<Game>> weeklySchedule) {
        // Don't schedule during bye weeks
        if (week == byeWeeks.get(game.getHomeTeam()) || week == byeWeeks.get(game.getAwayTeam())) {
            return false;
        }
        
        // Check for conflicts
        int homeTeamGames = (int) weeklySchedule.get(week).stream()
            .filter(g -> g.getHomeTeam().equals(game.getHomeTeam()) || g.getAwayTeam().equals(game.getHomeTeam()))
            .count();
        
        int awayTeamGames = (int) weeklySchedule.get(week).stream()
            .filter(g -> g.getHomeTeam().equals(game.getAwayTeam()) || g.getAwayTeam().equals(game.getAwayTeam()))
            .count();
        
        // Only schedule if there are no conflicts
        if (homeTeamGames == 0 && awayTeamGames == 0) {
            game.setWeek(week);
            weeklySchedule.get(week).add(game);
            return true;
        }
        
        return false;
    }

    // Renamed and deprecated - keep for compatibility but use the new methods
    private void scheduleGame(Game game, int idealWeek, Map<Team, Integer> byeWeeks, Map<Integer, List<Game>> weeklySchedule) {
        scheduleGameInWeek(game, idealWeek, byeWeeks, weeklySchedule);
    }

    // Find the week with the fewest games scheduled
    private int findBestWeek(Set<Integer> availableWeeks, Map<Integer, List<Game>> weeklySchedule) {
        return availableWeeks.stream()
            .min((w1, w2) -> Integer.compare(
                weeklySchedule.get(w1).size(),
                weeklySchedule.get(w2).size()
            ))
            .orElse(availableWeeks.iterator().next()); // Fallback to first available
    }

    // Get potential weeks for an unscheduled game
    private Set<Integer> getPotentialWeeks(Game game, Map<Team, Set<Integer>> teamScheduledWeeks, 
                                         Map<Team, Integer> byeWeeks) {
        Set<Integer> potentialWeeks = new HashSet<>();
        for (int week = 1; week <= TOTAL_WEEKS; week++) {
            potentialWeeks.add(week);
        }
        
        // Remove weeks where either team has a bye or already plays
        potentialWeeks.removeAll(teamScheduledWeeks.get(game.getHomeTeam()));
        potentialWeeks.removeAll(teamScheduledWeeks.get(game.getAwayTeam()));
        
        return potentialWeeks;
    }

    // Try to reschedule existing games to make room for the given game
    private boolean attemptRescheduleForGame(Game game, List<Game> scheduledGames, 
                                           Map<Integer, List<Game>> weeklySchedule,
                                           Map<Team, Set<Integer>> teamScheduledWeeks,
                                           Map<Team, Integer> byeWeeks) {
        // Get potential weeks for this game
        Set<Integer> potentialWeeks = getPotentialWeeks(game, teamScheduledWeeks, byeWeeks);
        
        if (!potentialWeeks.isEmpty()) {
            // If we have potential weeks, just schedule it (we missed it before somehow)
            int bestWeek = findBestWeek(potentialWeeks, weeklySchedule);
            game.setWeek(bestWeek);
            weeklySchedule.get(bestWeek).add(game);
            teamScheduledWeeks.get(game.getHomeTeam()).add(bestWeek);
            teamScheduledWeeks.get(game.getAwayTeam()).add(bestWeek);
            return true;
        }
        
        // No weeks available - need to try rescheduling other games to make room
        Team homeTeam = game.getHomeTeam();
        Team awayTeam = game.getAwayTeam();
        
        // Find all games involving either team
        List<Game> homeTeamGames = scheduledGames.stream()
            .filter(g -> g.getHomeTeam().equals(homeTeam) || g.getAwayTeam().equals(homeTeam))
            .collect(Collectors.toList());
        
        List<Game> awayTeamGames = scheduledGames.stream()
            .filter(g -> g.getHomeTeam().equals(awayTeam) || g.getAwayTeam().equals(awayTeam))
            .collect(Collectors.toList());
        
        // Try to move one of these games
        for (Game gameToMove : homeTeamGames) {
            // Skip bye week
            int currentWeek = gameToMove.getWeek();
            
            // Remove from current week
            weeklySchedule.get(currentWeek).remove(gameToMove);
            teamScheduledWeeks.get(gameToMove.getHomeTeam()).remove(currentWeek);
            teamScheduledWeeks.get(gameToMove.getAwayTeam()).remove(currentWeek);
            
            // See if our original game can now be scheduled
            Set<Integer> newPotentialWeeks = getPotentialWeeks(game, teamScheduledWeeks, byeWeeks);
            
            if (!newPotentialWeeks.isEmpty()) {
                // Schedule our original game
                int bestWeek = findBestWeek(newPotentialWeeks, weeklySchedule);
                game.setWeek(bestWeek);
                weeklySchedule.get(bestWeek).add(game);
                teamScheduledWeeks.get(homeTeam).add(bestWeek);
                teamScheduledWeeks.get(awayTeam).add(bestWeek);
                
                // Now try to reschedule the game we moved
                Set<Integer> movedGameWeeks = getPotentialWeeks(gameToMove, teamScheduledWeeks, byeWeeks);
                
                if (!movedGameWeeks.isEmpty()) {
                    // We can reschedule both games - success!
                    int newWeek = findBestWeek(movedGameWeeks, weeklySchedule);
                    gameToMove.setWeek(newWeek);
                    weeklySchedule.get(newWeek).add(gameToMove);
                    teamScheduledWeeks.get(gameToMove.getHomeTeam()).add(newWeek);
                    teamScheduledWeeks.get(gameToMove.getAwayTeam()).add(newWeek);
                    return true;
                }
                
                // If we can't reschedule the moved game, put it back
                weeklySchedule.get(bestWeek).remove(game);
                teamScheduledWeeks.get(homeTeam).remove(bestWeek);
                teamScheduledWeeks.get(awayTeam).remove(bestWeek);
                
                weeklySchedule.get(currentWeek).add(gameToMove);
                teamScheduledWeeks.get(gameToMove.getHomeTeam()).add(currentWeek);
                teamScheduledWeeks.get(gameToMove.getAwayTeam()).add(currentWeek);
            } else {
                // Put game back in original spot
                weeklySchedule.get(currentWeek).add(gameToMove);
                teamScheduledWeeks.get(gameToMove.getHomeTeam()).add(currentWeek);
                teamScheduledWeeks.get(gameToMove.getAwayTeam()).add(currentWeek);
            }
        }
        
        // Try the same with away team games
        for (Game gameToMove : awayTeamGames) {
            int currentWeek = gameToMove.getWeek();
            
            // Remove from current week
            weeklySchedule.get(currentWeek).remove(gameToMove);
            teamScheduledWeeks.get(gameToMove.getHomeTeam()).remove(currentWeek);
            teamScheduledWeeks.get(gameToMove.getAwayTeam()).remove(currentWeek);
            
            // See if our original game can now be scheduled
            Set<Integer> newPotentialWeeks = getPotentialWeeks(game, teamScheduledWeeks, byeWeeks);
            
            if (!newPotentialWeeks.isEmpty()) {
                // Schedule our original game
                int bestWeek = findBestWeek(newPotentialWeeks, weeklySchedule);
                game.setWeek(bestWeek);
                weeklySchedule.get(bestWeek).add(game);
                teamScheduledWeeks.get(homeTeam).add(bestWeek);
                teamScheduledWeeks.get(awayTeam).add(bestWeek);
                
                // Now try to reschedule the game we moved
                Set<Integer> movedGameWeeks = getPotentialWeeks(gameToMove, teamScheduledWeeks, byeWeeks);
                
                if (!movedGameWeeks.isEmpty()) {
                    // We can reschedule both games - success!
                    int newWeek = findBestWeek(movedGameWeeks, weeklySchedule);
                    gameToMove.setWeek(newWeek);
                    weeklySchedule.get(newWeek).add(gameToMove);
                    teamScheduledWeeks.get(gameToMove.getHomeTeam()).add(newWeek);
                    teamScheduledWeeks.get(gameToMove.getAwayTeam()).add(newWeek);
                    return true;
                }
                
                // If we can't reschedule the moved game, put it back
                weeklySchedule.get(bestWeek).remove(game);
                teamScheduledWeeks.get(homeTeam).remove(bestWeek);
                teamScheduledWeeks.get(awayTeam).remove(bestWeek);
                
                weeklySchedule.get(currentWeek).add(gameToMove);
                teamScheduledWeeks.get(gameToMove.getHomeTeam()).add(currentWeek);
                teamScheduledWeeks.get(gameToMove.getAwayTeam()).add(currentWeek);
            } else {
                // Put game back in original spot
                weeklySchedule.get(currentWeek).add(gameToMove);
                teamScheduledWeeks.get(gameToMove.getHomeTeam()).add(currentWeek);
                teamScheduledWeeks.get(gameToMove.getAwayTeam()).add(currentWeek);
            }
        }
        
        // Couldn't reschedule with single moves, would need more complex rescheduling
        return false;
    }
}



