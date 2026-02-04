package com.coderacer.backend.service;


import com.coderacer.backend.entity.CodeSnippet;
import com.coderacer.backend.repository.SnippetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SnippetCacheService {
    private final SnippetRepository snippetRepository;

    private final Map<String, List<CodeSnippet>> cache = new ConcurrentHashMap<>();

    private final Random random = new Random();

    public SnippetCacheService(SnippetRepository snippetRepository) {
        this.snippetRepository = snippetRepository;
    }

    public CodeSnippet getRandomSnippet(String language) {
        List<CodeSnippet> snippets = cache.computeIfAbsent(language, lang -> {
            List<CodeSnippet> fromDb = snippetRepository.findByLanguage(lang);
            System.out.println("fetching code snippet for lang: " + language);
            if (fromDb.isEmpty()) {
                throw new RuntimeException("No snippets for language: " + lang);
            }

            return List.copyOf(fromDb);
        });
        int index = random.nextInt(snippets.size());
        return snippets.get(index);
    }
}
