package com.meubar.gestao_estoque;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    //  Aqui seria onde os itens mostrados seriam apenas dos usuários logados
    List<Item> findByUsuarioId(Long usuarioId);
}