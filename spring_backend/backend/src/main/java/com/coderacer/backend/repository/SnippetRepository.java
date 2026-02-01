package com.coderacer.backend.repository;

import com.coderacer.backend.entity.CodeSnippet;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface SnippetRepository extends CrudRepository<CodeSnippet, Long> {
    List<CodeSnippet> findByLanguage(String language);
}
