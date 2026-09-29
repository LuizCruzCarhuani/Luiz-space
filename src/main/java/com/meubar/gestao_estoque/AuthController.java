package com.meubar.gestao_estoque;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpSession session) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Preencha todos os campos."));
        }

        // Procura pelo username
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getPassword().equals(password)) {
                session.setAttribute("usuarioLogado", usuario);
                return ResponseEntity.ok(Map.of("mensagem", "Login efetuado com sucesso!"));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensagem", "E-mail/Usuário ou senha incorretos."));
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Map<String, String> body, HttpSession session) {
        String nome = body.get("nome");
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null || username.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Usuário e senha são obrigatórios."));
        }

        // Verifica se o usuário/email já está cadastrado
        if (usuarioRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Este e-mail/usuário já está cadastrado."));
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(nome != null && !nome.isBlank() ? nome : username);
        novoUsuario.setUsername(username);
        novoUsuario.setPassword(password);

        try {
            Usuario salvo = usuarioRepository.save(novoUsuario);
            session.setAttribute("usuarioLogado", salvo);
            return ResponseEntity.ok(Map.of("mensagem", "Cadastro realizado com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensagem", "Erro ao salvar no banco de dados: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }
}