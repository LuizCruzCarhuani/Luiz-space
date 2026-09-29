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

        // Procura pelo username ou e-mail
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Compara a senha informada com a do banco
            if (usuario.getPassword().equals(password)) {
                // Guarda o utilizador logado na sessão HTTP
                session.setAttribute("usuarioLogado", usuario);
                return ResponseEntity.ok(Map.of("mensagem", "Login efetuado com sucesso"));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensagem", "E-mail/Usuário ou senha incorretos"));
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario novoUsuario, HttpSession session) {
        if (usuarioRepository.findByUsername(novoUsuario.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Usuário já cadastrado"));
        }

        Usuario salvo = usuarioRepository.save(novoUsuario);
        session.setAttribute("usuarioLogado", salvo);
        return ResponseEntity.ok(Map.of("mensagem", "Cadastro realizado com sucesso"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }
}