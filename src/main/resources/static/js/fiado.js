let listaFiados = [];

async function carregarFiados() {
    try {
        const res = await fetch('/api/fiados');
        if (res.ok) {
            listaFiados = await res.json();
            renderizarTabelaFiados();
            atualizarResumos();
        }
    } catch (err) {
        console.error("Erro ao carregar fiados:", err);
    }
}

async function cadastrarFiado(e) {
    e.preventDefault();
    const cliente = document.getElementById("nome-fiado").value;
    const valor = parseFloat(document.getElementById("valor-fiado").value);

    const res = await fetch('/api/fiados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente, valor })
    });

    if (res.ok) {
        document.getElementById("form-fiado").reset();
        carregarFiados();
    } else {
        alert("Erro ao cadastrar fiado.");
    }
}

function renderizarTabelaFiados() {
    const tbody = document.querySelector('#tabela-fiados tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (listaFiados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum fiado registrado.</td></tr>';
        return;
    }

    listaFiados.forEach(f => {
        let dotClass = 'dot-green';
        if (f.valor > 250) dotClass = 'dot-red';
        else if (f.valor > 100) dotClass = 'dot-yellow';

        tbody.innerHTML += `
            <tr>
                <td><span class="status-dot ${dotClass}"></span></td>
                <td><strong>${f.cliente}</strong></td>
                <td>R$ ${Number(f.valor).toFixed(2)}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editarFiado(${f.id}, '${f.cliente}', ${f.valor})">✏️ Editar</button>
                    <button class="btn-sm btn-delete" onclick="quitarFiado(${f.id})">✅ Quitar</button>
                </td>
            </tr>
        `;
    });
}

async function editarFiado(id, clienteAtual, valorAtual) {
    const novoCliente = prompt("Nome do Cliente:", clienteAtual);
    const novoValor = prompt("Novo Valor da Dívida (R$):", valorAtual);

    if (novoCliente && novoValor !== null) {
        await fetch(`/api/fiados/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cliente: novoCliente, 
                valor: parseFloat(novoValor) 
            })
        });
        carregarFiados();
    }
}

async function quitarFiado(id) {
    if (confirm("Confirmar que o cliente pagou e quitar a conta?")) {
        await fetch(`/api/fiados/${id}`, { method: 'DELETE' });
        carregarFiados();
    }
}

// Carregar os Fiados
document.addEventListener("DOMContentLoaded", () => {
    carregarFiados();
});