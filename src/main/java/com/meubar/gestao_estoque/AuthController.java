package com.meubar.gestao_estoque;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostConstruct
    public void init() {
        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = new Usuario("admin", "1234", "Gerente do Bar");
            usuarioRepository.save(admin);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String username = credenciais.get("username");
        String password = credenciais.get("password");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        if (usuarioOpt.isPresent() && usuarioOpt.get().getPassword().equals(password)) {
            Usuario u = usuarioOpt.get();
            Map<String, String> resposta = new HashMap<>();
            resposta.put("status", "sucesso");
            resposta.put("nome", u.getNome());
            resposta.put("username", u.getUsername());
            return ResponseEntity.ok(resposta);
        }

        Map<String, String> erro = new HashMap<>();
        erro.put("status", "erro");
        erro.put("mensagem", "Usuário ou senha incorretos!");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Map<String, String> dados) {
        String nome = dados.get("nome");
        String username = dados.get("username");
        String password = dados.get("password");

        if (usuarioRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("mensagem", "Este usuário/e-mail já está cadastrado!"));
        }

        
        String regexSenhaForte = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";
        if (password == null || !password.matches(regexSenhaForte)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("mensagem", "A senha precisa ter no mínimo 8 caracteres, uma letra maiúscula, um número e um símbolo (@#$%)."));
        }

        Usuario novoUsuario = new Usuario(username, password, nome);
        usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok(Map.of("status", "sucesso", "mensagem", "Cadastro realizado com sucesso!"));
    }
}