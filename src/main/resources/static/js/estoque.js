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
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    listaEstoque.forEach(item => {
        // Compatibilidade: se for produto antigo usa 'item.preco', se for novo usa 'precoCusto'
        let custoBase = (item.precoCusto !== undefined && item.precoCusto !== null) ? item.precoCusto : (item.preco || 0);
        let vendaBase = (item.precoVenda !== undefined && item.precoVenda !== null) ? item.precoVenda : 0;

        // Formata o texto da embalagem
        let descEmbalagem = item.tipoEmbalagem || 'Unidade';
        if (descEmbalagem !== 'Unidade' && item.unidadesPorEmbalagem > 1) {
            descEmbalagem += ` (${item.unidadesPorEmbalagem} un)`;
        }

        // Calcula o custo unitário real
        let custoUnit = custoBase;
        if (item.tipoEmbalagem && item.tipoEmbalagem !== 'Unidade' && item.unidadesPorEmbalagem > 0) {
            custoUnit = custoBase / item.unidadesPorEmbalagem;
        }

        // Calcula o lucro unitário estimado
        let lucroUnit = vendaBase - custoUnit;

        // Escapa aspas simples no nome caso algum produto tenha apóstrofo
        const nomeSeguro = String(item.nome || '').replace(/'/g, "\\'");

        tbody.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${descEmbalagem}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${Number(custoUnit).toFixed(2)}</td>
                <td>R$ ${Number(vendaBase).toFixed(2)}</td>
                <td style="color: #2ecc71;">R$ ${Number(lucroUnit).toFixed(2)}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="abrirModalEditar(${item.id}, '${nomeSeguro}', '${item.tipoEmbalagem || 'Unidade'}', ${item.unidadesPorEmbalagem || 1}, ${item.quantidade}, '${custoBase}', '${vendaBase}')">✏️ Editar</button>
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
    const tipoEmbalagem = document.getElementById("tipo-embalagem").value;
    const unidadesPorEmbalagem = parseInt(document.getElementById("unidades-por-embalagem").value, 10) || 1;
    const quantidade = parseInt(document.getElementById("qtd-item").value, 10) || 0;

    // Pega o valor e substitui vírgula por ponto para não bugar os centavos
    const custoStr = document.getElementById("preco-custo").value.replace(',', '.').trim();
    const vendaStr = document.getElementById("preco-item").value.replace(',', '.').trim();

    const precoCusto = parseFloat(custoStr) || 0;
    const precoVenda = parseFloat(vendaStr) || 0;

    await fetch('/api/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome,
            tipoEmbalagem,
            unidadesPorEmbalagem,
            quantidade,
            precoCusto,
            precoVenda,
            preco: precoCusto
        })
    });

    document.getElementById("form-item").reset();
    document.getElementById("bloco-qtd-por-embalagem").style.display = 'none';
    carregarEstoque();
}

function abrirModalEditar(id, nome, tipoEmb, unEmb, qtd, custo, venda) {
    document.getElementById("edit-id-item").value = id;
    document.getElementById("edit-nome-item").value = nome;
    document.getElementById("edit-tipo-embalagem").value = tipoEmb || "Unidade";
    document.getElementById("edit-unidades-por-embalagem").value = unEmb || 1;
    document.getElementById("edit-qtd-item").value = qtd;
    document.getElementById("edit-preco-custo").value = Number(custo || 0).toFixed(2);
    document.getElementById("edit-preco-venda").value = Number(venda || 0).toFixed(2);

    toggleCamposEmbalagemEdicao();
    document.getElementById("modal-editar-item").style.display = "flex";
}

function fecharModalEditar() {
    document.getElementById("modal-editar-item").style.display = "none";
}

function toggleCamposEmbalagemEdicao() {
    const tipo = document.getElementById("edit-tipo-embalagem").value;
    const bloco = document.getElementById("edit-bloco-qtd-por-embalagem");
    bloco.style.display = (tipo === "Fardo" || tipo === "Caixa") ? "block" : "none";
}

async function salvarEdicaoItem(e) {
    e.preventDefault();

    const id = document.getElementById("edit-id-item").value;
    const nome = document.getElementById("edit-nome-item").value.trim();
    const tipoEmbalagem = document.getElementById("edit-tipo-embalagem").value;
    const unidadesPorEmbalagem = parseInt(document.getElementById("edit-unidades-por-embalagem").value, 10) || 1;
    const quantidade = parseInt(document.getElementById("edit-qtd-item").value, 10) || 0;

    const custoStr = document.getElementById("edit-preco-custo").value.replace(',', '.').trim();
    const vendaStr = document.getElementById("edit-preco-venda").value.replace(',', '.').trim();

    const precoCusto = parseFloat(custoStr);
    const precoVenda = parseFloat(vendaStr);

    if (Number.isNaN(precoCusto) || Number.isNaN(precoVenda)) {
        alert("Digite valores válidos para custo e venda.");
        return;
    }

    const res = await fetch(`/api/estoque/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome,
            tipoEmbalagem,
            unidadesPorEmbalagem,
            quantidade,
            precoCusto,
            precoVenda,
            preco: precoCusto
        })
    });

    if (res.ok) {
        fecharModalEditar();
        carregarEstoque();
    } else {
        alert("Erro ao salvar edição do produto.");
    }
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

function toggleCamposEmbalagem() {
    const tipo = document.getElementById('tipo-embalagem').value;
    const bloco = document.getElementById('bloco-qtd-por-embalagem');

    if (tipo === 'Fardo' || tipo === 'Caixa') {
        bloco.style.display = 'block';
    } else {
        bloco.style.display = 'none';
    }
}