# Player Statistics Model Design

## GameStats.java
```java
package com.ddj.fbg.model.stats;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.Map;

@Document(collection = "game_stats")
public class GameStats {
    @Id
    private String id;
    private String gameId;
    private String playerId;
    private String teamId;
    private String leagueId;
    private Date gameDate;
    private boolean isPlayoff;
    private Map<String, Number> stats; // Dynamic stat fields
    
    // Position-specific stat interfaces
    public interface PassingStats {
        int getPassAttempts();
        int getCompletions();
        int getPassYards();
        // ... other passing stats
    }
    
    // Getters and setters
}
```

## SeasonStats.java
```java
 // Aggregated stats
    
    // Common calculated fields
    public interface CalculatedStats {
        double getAvgPassYards();
        double getCompletionPercentage();
        // ... other calculated stats
    }
    
    // Getters and setters
}
```

## StatIndexes.java
```java
package com.ddj.fbg.model.stats;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

@CompoundIndexes({
    @CompoundIndex(
        name = "player_season_idx",
        def = "{'playerId': 1, 'season': 1}",
        unique = true
    ),
    @CompoundIndex(
        name = "team_season_idx", 
        def = "{'teamId': 1, 'season': 1}"
    )
})
public class StatIndexes {
    // Index definitions only
}