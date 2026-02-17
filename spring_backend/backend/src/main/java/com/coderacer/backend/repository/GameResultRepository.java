package com.coderacer.backend.repository;

import com.coderacer.backend.entity.GameResult;
import com.coderacer.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameResultRepository extends JpaRepository<GameResult, Long> {

    List<GameResult> findTop30ByUserOrderByPlayedAtDesc(User user);

    List<GameResult> findTop30ByUserAndLanguageOrderByPlayedAtDesc(User user, String language);

}
