let meuGrafico = null;

function atualizarResumos() {
    const totalItens = listaEstoque.length;
    const valorEstoque = listaEstoque.reduce((acc, i) => acc + (i.quantidade * i.preco), 0);
    const totalFiado = listaFiados.reduce((acc, f) => acc + f.valor, 0);

    // Atualiza Home
    document.getElementById('home-total-itens').innerText = totalItens;
    document.getElementById('home-valor-estoque').innerText = `R$ ${valorEstoque.toFixed(2)}`;
    document.getElementById('home-total-fiado').innerText = `R$ ${totalFiado.toFixed(2)}`;

    // Atualiza Dashboard
    document.getElementById('dash-valor-estoque').innerText = `R$ ${valorEstoque.toFixed(2)}`;
    document.getElementById('dash-valor-fiado').innerText = `R$ ${totalFiado.toFixed(2)}`;

    const percentualRisco = valorEstoque > 0 ? ((totalFiado / valorEstoque) * 100).toFixed(1) : 0;
    document.getElementById('dash-risco-porcentagem').innerText = `${percentualRisco}% do valor do estoque`;
}

function renderizarGrafico() {
    const ctx = document.getElementById('graficoComparativo')?.getContext('2d');
    if (!ctx) return;

    const valorEstoque = listaEstoque.reduce((acc, i) => acc + (i.quantidade * i.preco), 0);
    const totalFiado = listaFiados.reduce((acc, f) => acc + f.valor, 0);

    if (meuGrafico) meuGrafico.destroy();

    meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Atual'],
            datasets: [
                {
                    label: 'Valor Total em Estoque (R$)',
                    data: [valorEstoque * 0.8, valorEstoque * 0.9, valorEstoque * 0.95, valorEstoque],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true
                },
                {
                    label: 'Total em Fiado / Devedores (R$)',
                    data: [totalFiado * 0.5, totalFiado * 0.7, totalFiado * 0.85, totalFiado],
                    borderColor: '#e74c3c',
                    borderWidth: 2,
                    borderDash: [6, 6],
                    fill: false
                }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}