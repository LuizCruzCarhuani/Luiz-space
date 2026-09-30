let listaFiados = JSON.parse(localStorage.getItem('stockla_fiados')) || [];

function cadastrarFiado(e) {
    e.preventDefault();
    const nome = document.getElementById("nome-fiado").value;
    const valor = parseFloat(document.getElementById("valor-fiado").value);

    listaFiados.push({ id: Date.now(), cliente: nome, valor: valor });
    salvarFiados();
    document.getElementById("form-fiado").reset();
    renderizarTabelaFiados();
    atualizarResumos();
}

function salvarFiados() {
    localStorage.setItem('stockla_fiados', JSON.stringify(listaFiados));
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
                <td>R$ ${f.valor.toFixed(2)}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="alterarFiado(${f.id}, 10)">+ R$10</button>
                    <button class="btn-sm btn-zero" onclick="alterarFiado(${f.id}, -10)">- R$10</button>
                    <button class="btn-sm btn-delete" onclick="quitarFiado(${f.id})">✅ Quitar</button>
                </td>
            </tr>
        `;
    });
}

function alterarFiado(id, delta) {
    const item = listaFiados.find(f => f.id === id);
    if (item) {
        item.valor = Math.max(0, item.valor + delta);
        salvarFiados();
        renderizarTabelaFiados();
        atualizarResumos();
    }
}

function quitarFiado(id) {
    if (confirm("Confirmar que o cliente pagou e quitar a conta?")) {
        listaFiados = listaFiados.filter(f => f.id !== id);
        salvarFiados();
        renderizarTabelaFiados();
        atualizarResumos();
    }
}