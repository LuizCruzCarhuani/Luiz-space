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
        // Formata o texto da embalagem
        let descEmbalagem = item.tipoEmbalagem || 'Unidade';
        if (descEmbalagem !== 'Unidade' && item.unidadesPorEmbalagem > 1) {
            descEmbalagem += ` (${item.unidadesPorEmbalagem} un)`;
        }

        // Calcula o custo unitário real (se for fardo/caixa, divide o preço total pelas unidades)
        let custoUnit = item.precoCusto;
        if (item.tipoEmbalagem && item.tipoEmbalagem !== 'Unidade' && item.unidadesPorEmbalagem > 0) {
            custoUnit = item.precoCusto / item.unidadesPorEmbalagem;
        }

        // Calcula o lucro unitário estimado
        let lucroUnit = (item.precoVenda || 0) - custoUnit;

        tbody.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${descEmbalagem}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${Number(custoUnit).toFixed(2)}</td>
                <td>R$ ${Number(item.precoVenda || 0).toFixed(2)}</td>
                <td style="color: #2ecc71;">R$ ${Number(lucroUnit).toFixed(2)}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editarItem(${item.id}, '${item.nome}', '${item.tipoEmbalagem || 'Unidade'}', ${item.unidadesPorEmbalagem || 1}, ${item.quantidade}, ${item.precoCusto || 0}, ${item.precoVenda || 0})">✏️ Editar</button>
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
    const unidadesPorEmbalagem = parseInt(document.getElementById("unidades-por-embalagem").value) || 1;
    const quantidade = parseInt(document.getElementById("qtd-item").value);
    const precoCusto = parseFloat(document.getElementById("preco-custo").value);
    const precoVenda = parseFloat(document.getElementById("preco-item").value);

    await fetch('/api/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nome, 
            tipoEmbalagem, 
            unidadesPorEmbalagem, 
            quantidade, 
            precoCusto, 
            precoVenda 
        })
    });
    
    document.getElementById("form-item").reset();
    document.getElementById("bloco-qtd-por-embalagem").style.display = 'none';
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

async function editarItem(id, nome, tipoEmb, unEmb, qtd, custo, venda) {
    const novoNome = prompt("Novo Nome:", nome);
    const novoTipoEmb = prompt("Tipo de Embalagem (Unidade, Fardo, Caixa):", tipoEmb);
    let novaUnEmb = unEmb;
    
    if (novoTipoEmb && novoTipoEmb !== 'Unidade') {
        novaUnEmb = prompt("Quantas unidades vêm no Fardo/Caixa?", unEmb);
    }
    
    const novaQtd = prompt("Nova Quantidade:", qtd);
    const novoCusto = prompt("Novo Preço de Custo (R$):", custo);
    const novoVenda = prompt("Novo Preço de Venda Unitário (R$):", venda);

    if (novoNome && novaQtd !== null && novoCusto !== null && novoVenda !== null) {
        await fetch(`/api/estoque/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nome: novoNome, 
                tipoEmbalagem: novoTipoEmb || 'Unidade',
                unidadesPorEmbalagem: parseInt(novaUnEmb) || 1,
                quantidade: parseInt(novaQtd), 
                precoCusto: parseFloat(novoCusto),
                precoVenda: parseFloat(novoVenda)
            })
        });
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