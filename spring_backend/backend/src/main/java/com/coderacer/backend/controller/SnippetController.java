package com.coderacer.backend.controller;

import com.coderacer.backend.entity.CodeSnippet;
import com.coderacer.backend.repository.SnippetRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SnippetController {
    private final SnippetRepository repository;

    // constructor injection
    public SnippetController(SnippetRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/snippet/{language}")
    public List<CodeSnippet> returnSnippets(@PathVariable String language) {
        System.out.println("testing the endpoint for language: " + language);
        return repository.findByLanguage(language);
    }
}
