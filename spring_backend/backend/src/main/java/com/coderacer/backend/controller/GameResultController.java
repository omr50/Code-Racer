package com.coderacer.backend.controller;

import com.coderacer.backend.dto.CreateGameResultRequest;
import com.coderacer.backend.entity.GameResult;
import com.coderacer.backend.entity.User;
import com.coderacer.backend.repository.GameResultRepository;
import com.coderacer.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameResultController {

    private final GameResultRepository gameRepo;
    private final UserRepository userRepo;

    public GameResultController(GameResultRepository gameRepo,
                                UserRepository userRepo) {
        this.gameRepo = gameRepo;
        this.userRepo = userRepo;
    }

    // 🔹 POST - Save Game (JWT Protected)
    @PostMapping
    public ResponseEntity<?> saveGame(
            @RequestBody CreateGameResultRequest request,
            Authentication authentication
    ) {

        // Extract email from JWT (Spring Security puts it here)
        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        GameResult game = new GameResult();
        game.setWpm(request.getWpm());
        game.setAccuracy(request.getAccuracy());
        game.setMistakes(request.getMistakes());
        game.setDurationSeconds(request.getDurationSeconds());
        game.setLanguage(request.getLanguage());
        game.setPlayedAt(LocalDateTime.now());
        game.setUser(user);

        gameRepo.save(game);

        return ResponseEntity.ok().build();
    }


    // 🔹 GET - Fetch Top 30 (Optional Language Filter)
    @GetMapping
    public ResponseEntity<List<GameResult>> getGames(
            @RequestParam(required = false) String language,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<GameResult> games;

        if (language != null && !language.isBlank()) {
            games = gameRepo.findTop30ByUserAndLanguageOrderByPlayedAtDesc(user, language);
        } else {
            games = gameRepo.findTop30ByUserOrderByPlayedAtDesc(user);
        }

        return ResponseEntity.ok(games);
    }
}
