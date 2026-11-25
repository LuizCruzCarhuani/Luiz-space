let meuGrafico = null;

function calcularMetricasEstoque() {
    let valorEstoque = 0;
    let possivelLucroBruto = 0;

    listaEstoque.forEach((i) => {
        const qtd = Number(i.quantidade) || 0;
        const custoBase = (i.precoCusto !== undefined && i.precoCusto !== null)
            ? Number(i.precoCusto)
            : (Number(i.preco) || 0);
        const vendaBase = (i.precoVenda !== undefined && i.precoVenda !== null)
            ? Number(i.precoVenda)
            : 0;

        const temEmbalagem = i.tipoEmbalagem && i.tipoEmbalagem !== 'Unidade' && (Number(i.unidadesPorEmbalagem) > 1);
        const unPorEmb = temEmbalagem ? Number(i.unidadesPorEmbalagem) : 1;

        // Valor total do estoque a preço de custo
        valorEstoque += qtd * custoBase;

        // Lucro unitário estimado (venda unitária - custo unitário)
        const custoUnit = temEmbalagem ? (custoBase / unPorEmb) : custoBase;
        const lucroUnit = vendaBase - custoUnit;

        possivelLucroBruto += lucroUnit * qtd;
    });

    return { valorEstoque, possivelLucroBruto };
}

function atualizarResumos() {
    const totalItens = listaEstoque.length;
    const { valorEstoque, possivelLucroBruto } = calcularMetricasEstoque();
    const totalFiado = listaFiados.reduce((acc, f) => acc + (Number(f.valor) || 0), 0);

    // Atualiza Home
    const elTotalItens = document.getElementById('home-total-itens');
    const elValorEstoque = document.getElementById('home-valor-estoque');
    const elTotalFiado = document.getElementById('home-total-fiado');
    const elHomeLucro = document.getElementById('home-lucro-bruto');

    if (elTotalItens) elTotalItens.innerText = totalItens;
    if (elValorEstoque) elValorEstoque.innerText = `R$ ${valorEstoque.toFixed(2)}`;
    if (elTotalFiado) elTotalFiado.innerText = `R$ ${totalFiado.toFixed(2)}`;
    if (elHomeLucro) elHomeLucro.innerText = `R$ ${possivelLucroBruto.toFixed(2)}`;

    // Atualiza Dashboard
    const elDashEstoque = document.getElementById('dash-valor-estoque');
    const elDashFiado = document.getElementById('dash-valor-fiado');
    const elDashRisco = document.getElementById('dash-risco-porcentagem');
    const elDashLucro = document.getElementById('dash-lucro-bruto');

    if (elDashEstoque) elDashEstoque.innerText = `R$ ${valorEstoque.toFixed(2)}`;
    if (elDashFiado) elDashFiado.innerText = `R$ ${totalFiado.toFixed(2)}`;
    if (elDashLucro) elDashLucro.innerText = `R$ ${possivelLucroBruto.toFixed(2)}`;

    const percentualRisco = valorEstoque > 0 ? ((totalFiado / valorEstoque) * 100).toFixed(1) : 0;
    if (elDashRisco) elDashRisco.innerText = `${percentualRisco}% do valor do estoque`;
}

function renderizarGrafico() {
    const ctx = document.getElementById('graficoComparativo')?.getContext('2d');
    if (!ctx) return;

    const { valorEstoque } = calcularMetricasEstoque();
    const totalFiado = listaFiados.reduce((acc, f) => acc + (Number(f.valor) || 0), 0);

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