let modoCadastro = false;

function alternarModoAuth() {
    modoCadastro = !modoCadastro;
    document.getElementById("auth-title").innerText = modoCadastro ? "Criar Conta" : "Entrar";
    document.getElementById("btn-auth-submit").innerText = modoCadastro ? "Cadastrar" : "Entrar";
    document.getElementById("auth-toggle-text").innerText = modoCadastro ? "Já tem conta?" : "Não tem conta?";
    document.getElementById("auth-toggle-link").innerText = modoCadastro ? "Fazer Login" : "Cadastrar-se";
    document.getElementById("field-nome").style.display = modoCadastro ? "block" : "none";
}

async function processarAuth(e) {
    if (e) e.preventDefault();
    const erroEl = document.getElementById("auth-erro");
    erroEl.style.display = "none";

    const username = document.getElementById("auth-user").value;
    const password = document.getElementById("auth-pass").value;
    const nome = document.getElementById("auth-nome")?.value;

    const endpoint = modoCadastro ? "/api/cadastrar" : "/api/login";
    const corpo = modoCadastro ? { nome, username, password } : { username, password };

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
            document.getElementById("auth-modal").style.display = "none";
            carregarEstoque();
        } else {
            erroEl.innerText = data.mensagem || "Erro ao realizar autenticação";
            erroEl.style.display = "block";
        }
    } catch (err) {
        erroEl.innerText = "Erro na conexão com o servidor";
        erroEl.style.display = "block";
    }
}

function logout() {
    fetch('/api/logout', { method: 'POST' }).catch(() => {});
    document.getElementById("auth-modal").style.display = "flex";
}