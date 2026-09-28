package com.meubar.gestao_estoque;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/estoque")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    // Retorna apenas o estoque do utilizador logado
    @GetMapping
    public List<Item> listarEstoque(HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão expirada");
        }
        return itemRepository.findByUsuarioId(usuarioLogado.getId());
    }

    // Salva o item associado ao utilizador logado
    @PostMapping
    public Item salvarItem(@RequestBody Item item, HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão expirada");
        }
        item.setUsuario(usuarioLogado);
        return itemRepository.save(item);
    }

    // Editar item
    @PutMapping("/{id}")
    public ResponseEntity<Item> editarItem(@PathVariable Long id, @RequestBody Item itemAtualizado) {
        return itemRepository.findById(id).map(item -> {
            item.setNome(itemAtualizado.getNome());
            item.setQuantidade(itemAtualizado.getQuantidade());
            item.setPreco(itemAtualizado.getPreco());
            return ResponseEntity.ok(itemRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Zerar quantidade do item
    @PatchMapping("/{id}/zerar")
    public ResponseEntity<Void> zerarEstoque(@PathVariable Long id) {
        return itemRepository.findById(id).map(item -> {
            item.setQuantidade(0);
            itemRepository.save(item);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Função Excluir Item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirItem(@PathVariable Long id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}