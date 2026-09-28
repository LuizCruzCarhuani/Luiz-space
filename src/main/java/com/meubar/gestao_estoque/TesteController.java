package com.meubar.gestao_estoque;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TesteController {

    @GetMapping("/status")
    public String verificarStatus() {
        return "API do Bar rodando com sucesso no VS Code!";
    }
}