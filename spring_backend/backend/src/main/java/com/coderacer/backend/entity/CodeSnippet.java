package com.coderacer.backend.entity;


import jakarta.persistence.*;

@Entity
@Table(name="snippets")
public class CodeSnippet {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    @Column(name = "language", length = 255)
    private String language;
    @Column(name = "code", length = 10000)
    private String code;

    protected CodeSnippet() {}

    public CodeSnippet(String language, String code) {
        this.language = language;
        this.code = code;
    }

    @Override
    public String toString() {
        return String.format(
                "Snippet[id=%d, language='%s', code='%s']",
                id, language, code);
    }

    public Long getId() {
        return id;
    }

    public String getLanguage() {
        return language;
    }

    public String getCode() {
        return code;
    }

}
