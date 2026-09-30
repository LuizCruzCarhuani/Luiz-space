function mudarAba(nomeAba, elemento) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${nomeAba}`).classList.add('active');
    if (elemento) elemento.classList.add('active');

    if (nomeAba === 'dashboard') renderizarGrafico();
}

document.addEventListener("DOMContentLoaded", carregarEstoque);