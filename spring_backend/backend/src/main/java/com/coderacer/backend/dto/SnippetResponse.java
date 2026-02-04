package com.coderacer.backend.dto;

import com.coderacer.backend.entity.CodeSnippet;

public class SnippetResponse {
    private String snippet;

    public SnippetResponse(CodeSnippet snippet) {
        this.snippet = snippet.getCode();
    }

    public String getSnippet() {
        return snippet;
    }
}
