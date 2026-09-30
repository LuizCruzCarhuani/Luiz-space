let listaEstoque = [];

async function carregarEstoque() {
    try {
        const res = await fetch('/api/estoque');
        if (res.status === 401) {
            document.getElementById("auth-modal").style.display = "flex";
            return;
        }
        document.getElementById("auth-modal").style.display = "none";
        listaEstoque = await res.json();
        renderizarTabelaEstoque();
        renderizarTabelaFiados();
        atualizarResumos();
    } catch (err) {
        console.error("Erro ao carregar estoque:", err);
    }
}

function renderizarTabelaEstoque() {
    const tbody = document.querySelector('#tabela-estoque tbody');
    tbody.innerHTML = '';

    if (listaEstoque.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    listaEstoque.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${Number(item.preco).toFixed(2)}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editarItem(${item.id}, '${item.nome}', ${item.quantidade}, ${item.preco})">✏️ Editar</button>
                    <button class="btn-sm btn-zero" onclick="zerarEstoque(${item.id})">⚠️ Zerar</button>
                    <button class="btn-sm btn-delete" onclick="excluirItem(${item.id})">🗑️ Excluir</button>
                </td>
            </tr>
        `;
    });
}

async function cadastrarItem(e) {
    e.preventDefault();
    const nome = document.getElementById("nome-item").value;
    const quantidade = parseInt(document.getElementById("qtd-item").value);
    const preco = parseFloat(document.getElementById("preco-item").value);

    await fetch('/api/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, quantidade, preco })
    });
    document.getElementById("form-item").reset();
    carregarEstoque();
}

async function zerarEstoque(id) {
    if (confirm("Deseja zerar a quantidade deste produto?")) {
        await fetch(`/api/estoque/${id}/zerar`, { method: 'PATCH' });
        carregarEstoque();
    }
}

async function excluirItem(id) {
    if (confirm("Excluir este item permanentemente?")) {
        await fetch(`/api/estoque/${id}`, { method: 'DELETE' });
        carregarEstoque();
    }
}

async function editarItem(id, nome, qtd, preco) {
    const novoNome = prompt("Novo Nome:", nome);
    const novaQtd = prompt("Nova Quantidade:", qtd);
    const novoPreco = prompt("Novo Preço (R$):", preco);

    if (novoNome && novaQtd !== null && novoPreco !== null) {
        await fetch(`/api/estoque/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: novoNome, quantidade: parseInt(novaQtd), preco: parseFloat(novoPreco) })
        });
        carregarEstoque();
    }
}