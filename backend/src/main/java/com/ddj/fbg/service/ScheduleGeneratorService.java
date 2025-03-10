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

    public Map<Integer, List<Game>> generateWeeklySchedule(List<Team> teams)  {
        this.teams = teams;
        List<Game> allGames = generateAllMatchups();
        // System.out.println("allGames length: " + allGames.size());
        Map<Team, Integer> byeWeeks = assignByeWeeks();
        Map<Integer, List<Game>> weeklySchedule = new TreeMap<>();
        
        for (int week = 1; week <= TOTAL_WEEKS; week++) {
            weeklySchedule.put(week, new ArrayList<>());
        }

        for (Game game : allGames) {
            int idealWeek = calculateIdealWeek(game);
            scheduleGame(game, idealWeek, byeWeeks, weeklySchedule);
        }

        for (int week : weeklySchedule.keySet()) {
            System.out.println("\nWeek " + week + ":");
            for (Game game : weeklySchedule.get(week)) {
                System.out.printf("  %s at %s%n", 
                    game.getAwayTeam().getName(), game.getHomeTeam().getName());
            }
        }

        return weeklySchedule;
    }

    private List<Game> generateAllMatchups() {
        List<Game> allMatchups = new ArrayList<>();
        
        // 1. Division games (home and away)
        for (Team team : teams) {
            for (Team divisionOpponent : getDivisionOpponents(team)) {
                // Double-header division games
                allMatchups.add(new Game(team, divisionOpponent, -1, currentYear));
                allMatchups.add(new Game(divisionOpponent, team, -1, currentYear));
            }
        }
        
        // 2. Generate other matchups with controlled home/away
        Set<String> scheduledMatchups = new HashSet<>();
        for (Team team : teams) {

            List<Team> interConferenceOpponents = getInterConferenceOpponents(team); // should be 4 + 2 + 1
            List<Team> intraConferenceOpponenets = getIntraConferenceOpponents(team); // should be 4 + 2

            List<Team> otherOpponents = new ArrayList<>();
            otherOpponents.addAll(interConferenceOpponents);
            otherOpponents.addAll(intraConferenceOpponenets);

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

        // 3. Ensure all matchups are unique
        List<Game> uniqueGames = deduplicateGames(allMatchups);
        
        System.out.println("uniqueGames length: " + uniqueGames.size());

        // for (Game g : uniqueGames) {
        //     System.out.println(g.getHomeTeam().getName() + " vs " + g.getAwayTeam().getName());
        // }

        return uniqueGames;
    }

    // private List<Game> generateAllMatchups() {
        // List<Game> games = new ArrayList<>();
        
        // for (Team team : teams) {
        //     // Division games (home/away)            
        //     List<Team> interConferenceOpponents = getInterConferenceOpponents(team); // should be 4 + 2 + 1
        //     List<Team> intraConferenceOpponenets = getIntraConferenceOpponents(team); // should be 4 + 2

        //     List<Team> otherOpponents = new ArrayList<>();
        //     otherOpponents.addAll(interConferenceOpponents);
        //     otherOpponents.addAll(intraConferenceOpponenets);

        //     for (Team opponent : otherOpponents) {
        //         boolean home = random.nextBoolean();
        //         if (home) {
        //             games.add(new Game(team, opponent, -1, currentYear));
        //         } else {
        //             games.add(new Game(opponent, team, -1, currentYear));
        //         }
        //     }


        // }
        // for (Team team : teams) {
        //     for (Team divisionOpponent : getDivisionOpponents(team)) {
        //         games.add(new Game(team, divisionOpponent, -1, currentYear));
        //         games.add(new Game(divisionOpponent, team, -1, currentYear));
        //     }
        // }
        // List<Game> uniqueGames = deduplicateGames(games);
        // System.out.println("uniqueGames length: " + uniqueGames.size());



        // System.out.println("games length: " + games.size());

        // for (Game g : uniqueGames) {
        //     System.out.println(g.getHomeTeam().getName() + " vs " + g.getAwayTeam().getName());
        // }

        // return uniqueGames;
    // }

    // private List<Game> deduplicateGames(List<Game> games) {
    //     Set<String> matchupKeys = new HashSet<>();
    //     List<Game> uniqueGames = new ArrayList<>();
    
    //     for (Game game : games) {
    //         // Create sorted key to eliminate directionality
    //         String key = createMatchupKey(game.getHomeTeam(), game.getAwayTeam());
    
    //         if (!matchupKeys.contains(key)) {
    //             uniqueGames.add(game);
    //             matchupKeys.add(key);
    //         }
    //     }
    //     return uniqueGames;
    // }
    
    private String createMatchupKey(Team team1, Team team2) {
        // Alphabetical sorting ensures consistent key regardless of home/away
        String[] names = {team1.getName(), team2.getName()};
        Arrays.sort(names);
        return names[0] + ":" + names[1];
    }

// private List<Game> deduplicateGames(List<Game> games) {
//     Set<String> matchupKeys = new HashSet<>();
//     List<Game> uniqueGames = new ArrayList<>();

//     for (Game game : games) {
//         // Create sorted key to eliminate directionality
//         String key = createMatchupKey(game.homeTeam, game.awayTeam);

//         if (!matchupKeys.contains(key)) {
//             uniqueGames.add(game);
//             matchupKeys.add(key);
//         }
//     }
//     return uniqueGames;
// }

// private String createMatchupKey(Team team1, Team team2) {
//     // Alphabetical sorting ensures consistent key regardless of home/away
//     String[] names = {team1.name, team2.name};
//     Arrays.sort(names);
//     return names[0] + ":" + names[1];
// }


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
            return random.nextInt(4) + 14; // Weeks 14-17
        }
        return random.nextInt(13) + 1; // Weeks 1-13
    }

    private void scheduleGame(Game game, int idealWeek, Map<Team, Integer> byeWeeks, Map<Integer, List<Game>> weeklySchedule) {

        for (int weekOffset = 0; weekOffset < TOTAL_WEEKS; weekOffset++) {
            int tryWeek = (idealWeek + weekOffset) % TOTAL_WEEKS;
            if (tryWeek == 0) tryWeek = TOTAL_WEEKS;
            
            if (isValidWeek(game, tryWeek, byeWeeks, weeklySchedule)) {
                game.setWeek(tryWeek);
                weeklySchedule.get(tryWeek).add(game);
                return;
            }
        }
        // Fallback (shouldn't happen with proper configuration)
        game.setWeek(1);
        weeklySchedule.get(1).add(game);
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


}


