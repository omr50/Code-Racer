package com.coderacer.backend.controller;

import com.coderacer.backend.dto.SnippetResponse;
import com.coderacer.backend.entity.CodeSnippet;
import com.coderacer.backend.repository.SnippetRepository;
import com.coderacer.backend.service.SnippetCacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class SnippetController {
    private final SnippetRepository repository;
    private final SnippetCacheService snippetCacheService;

//     constructor injection
    public SnippetController(SnippetRepository repository, SnippetCacheService snippetCacheService) {
        this.repository = repository;
        this.snippetCacheService = snippetCacheService;
    }

    @GetMapping("/game/{language}")
    public SnippetResponse returnSnippets(@PathVariable String language) {
        System.out.println("testing the endpoint for language: " + language);
        CodeSnippet snippet = snippetCacheService.getRandomSnippet(language);
        return new SnippetResponse(snippet);
    }
}
