package com.meubar.gestao_estoque;

import jakarta.persistence.*;

@Entity
@Table(name = "itens")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String tipoEmbalagem;
    private Integer unidadesPorEmbalagem = 1;
    private Integer quantidade;
    private Double preco;
    private Double precoCusto;
    private Double precoVenda;

    // Relacionamento para isolar os dados por usuário
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public Item() {}

    public Item(String nome, Integer quantidade, Double preco, Usuario usuario) {
        this.nome = nome;
        this.quantidade = quantidade;
        this.preco = preco;
        this.usuario = usuario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTipoEmbalagem() { return tipoEmbalagem; }
    public void setTipoEmbalagem(String tipoEmbalagem) { this.tipoEmbalagem = tipoEmbalagem; }

    public Integer getUnidadesPorEmbalagem() { return unidadesPorEmbalagem; }
    public void setUnidadesPorEmbalagem(Integer unidadesPorEmbalagem) { this.unidadesPorEmbalagem = unidadesPorEmbalagem; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }

    public Double getPrecoCusto() { return precoCusto; }
    public void setPrecoCusto(Double precoCusto) { this.precoCusto = precoCusto; }

    public Double getPrecoVenda() { return precoVenda; }
    public void setPrecoVenda(Double precoVenda) { this.precoVenda = precoVenda; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}