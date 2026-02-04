package com.coderacer.backend.repository;

import com.coderacer.backend.entity.CodeSnippet;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SnippetRepository extends CrudRepository<CodeSnippet, Long> {
    List<CodeSnippet> findByLanguage(String language);

    @Query(value = """
            SELECT *
            FROM snippets
            WHERE language = :language
            ORDER BY RANDOM()
            LIMIT 1
            """, nativeQuery = true)
    Optional<CodeSnippet> findRandomByLanguage(@Param("language") String language);
}
