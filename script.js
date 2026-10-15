
// ==========================================
// 1. ELEMENTOS DO HTML
// ==========================================

const formulario = document.getElementById("form-atendimento");
const lista = document.getElementById("lista");

const totalTarefas = document.getElementById("total-tarefas");
const tarefasPendentes = document.getElementById("tarefas-pendentes");
const tarefasConcluidas = document.getElementById("tarefas-concluidas");

const filtroTodos = document.getElementById("filtro-todos");
const filtroPendentes = document.getElementById("filtro-pendentes");
const filtroConcluidos = document.getElementById("filtro-concluidos");
const filtroCategoria = document.getElementById("filtro-categoria");

const mensagemVazia = document.getElementById("mensagem-vazia");


// ==========================================
// 2. RECUPERAR OS DADOS DO LOCALSTORAGE
// ==========================================

// Começa com uma lista vazia.
let atendimentos = [];

// Tenta recuperar os atendimentos salvos no navegador.
try {
    atendimentos = JSON.parse(
        localStorage.getItem("atendimentos")
    ) || [];
} catch (erro) {
    console.error("Erro ao recuperar os atendimentos:", erro);
}

// Salva a lista atualizada no navegador.
function salvarAtendimentos() {
    localStorage.setItem(
        "atendimentos",
        JSON.stringify(atendimentos)
    );
}


// ==========================================
// 3. ATUALIZAR OS INDICADORES
// ==========================================

function atualizarIndicadores() {

    const total = atendimentos.length;

    const concluidos = atendimentos.filter(function(atendimento) {
        return atendimento.concluida;
    }).length;

    const pendentes = total - concluidos;

    totalTarefas.textContent = total;
    tarefasConcluidas.textContent = concluidos;
    tarefasPendentes.textContent = pendentes;

    // Mostra a mensagem quando a lista estiver vazia.
    mensagemVazia.style.display =
        total === 0 ? "block" : "none";
}


// ==========================================
// 4. APLICAR OS FILTROS
// ==========================================

// Guarda o filtro de situação selecionado.
let situacaoAtual = "todos";

function aplicarFiltros() {

    const itensNaTela = lista.querySelectorAll(
        "li:not(#mensagem-vazia)"
    );

    itensNaTela.forEach(function(item) {

        const concluido = item.dataset.concluida === "true";
        const categoria = item.dataset.categoria;

        let mostrarSituacao = true;
        let mostrarCategoria = true;

        // Verifica o filtro de situação.
        if (situacaoAtual === "pendentes") {
            mostrarSituacao = !concluido;
        }

        if (situacaoAtual === "concluidos") {
            mostrarSituacao = concluido;
        }

        // Verifica o filtro de categoria.
        const categoriaSelecionada = filtroCategoria.value;

        if (categoriaSelecionada !== "Todas") {
            mostrarCategoria = categoria === categoriaSelecionada;
        }

        // O atendimento aparece somente se passar pelos dois filtros.
        item.style.display =
            mostrarSituacao && mostrarCategoria ? "block" : "none";

    });
}


// ==========================================
// 5. EVENTOS DOS FILTROS
// ==========================================

filtroTodos.addEventListener("click", function() {
    situacaoAtual = "todos";
    aplicarFiltros();
});

filtroPendentes.addEventListener("click", function() {
    situacaoAtual = "pendentes";
    aplicarFiltros();
});

filtroConcluidos.addEventListener("click", function() {
    situacaoAtual = "concluidos";
    aplicarFiltros();
});

filtroCategoria.addEventListener("change", function() {
    aplicarFiltros();
});


// ==========================================
// 6. EXIBIR OS ATENDIMENTOS NA TELA
// ==========================================

function renderizarAtendimentos() {

    // Remove os atendimentos antigos da tela,
    // mas mantém a mensagem de lista vazia.
    const itensAntigos = lista.querySelectorAll(
        "li:not(#mensagem-vazia)"
    );

    itensAntigos.forEach(function(item) {
        item.remove();
    });

    // Percorre os registros salvos e cria os elementos na tela.
    atendimentos.forEach(function(atendimento) {

        const novoAtendimento = document.createElement("li");

        // Guarda informações para os filtros.
        novoAtendimento.dataset.categoria = atendimento.categoria;
        novoAtendimento.dataset.concluida = atendimento.concluida;

        // Aplica o estilo de concluído, se necessário.
        if (atendimento.concluida) {
            novoAtendimento.classList.add("concluida");
        }

        // Função auxiliar para adicionar informações com segurança.
        function adicionarInformacao(rotulo, valor) {

            const textoForte = document.createElement("strong");
            textoForte.textContent = rotulo;

            novoAtendimento.appendChild(textoForte);
            novoAtendimento.appendChild(
                document.createTextNode(" " + valor)
            );
            novoAtendimento.appendChild(
                document.createElement("br")
            );
        }

        adicionarInformacao("Paciente:", atendimento.paciente);
        adicionarInformacao("Idade:", atendimento.idade + " anos");
        adicionarInformacao("Tarefa:", atendimento.tarefa);
        adicionarInformacao("Categoria:", atendimento.categoria);

        // Cria a informação de prioridade.
        const textoPrioridade = document.createElement("strong");
        textoPrioridade.textContent = "Prioridade:";

        const etiquetaPrioridade = document.createElement("span");

        let classePrioridade = atendimento.prioridade.toLowerCase();

        if (atendimento.prioridade === "Média") {
            classePrioridade = "media";
        }

        etiquetaPrioridade.className =
            "prioridade-" + classePrioridade;

        etiquetaPrioridade.textContent = atendimento.prioridade;

        novoAtendimento.appendChild(textoPrioridade);
        novoAtendimento.appendChild(document.createTextNode(" "));
        novoAtendimento.appendChild(etiquetaPrioridade);
        novoAtendimento.appendChild(document.createElement("br"));

        adicionarInformacao("Data da consulta:", atendimento.data);
        adicionarInformacao("Horário:", atendimento.horario);
        adicionarInformacao("Pagamento:", atendimento.pagamento);

        // ==========================================
        // 7. BOTÃO CONCLUIR / REABRIR
        // ==========================================

        const botaoConcluir = document.createElement("button");
        botaoConcluir.type = "button";

        botaoConcluir.className = "btn-concluir";

        botaoConcluir.textContent = atendimento.concluida
            ? "Reabrir atendimento"
            : "Concluir atendimento";

        botaoConcluir.addEventListener("click", function() {

            // Altera o estado do atendimento.
            atendimento.concluida = !atendimento.concluida;

            // Salva a alteração.
            salvarAtendimentos();

            // Atualiza a tela.
            renderizarAtendimentos();
            atualizarIndicadores();

        });

        novoAtendimento.appendChild(botaoConcluir);

        // ==========================================
        // 8. BOTÃO EXCLUIR
        // ==========================================

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.className = "btn-excluir";
        botaoExcluir.textContent = "Excluir atendimento";

        botaoExcluir.addEventListener("click", function() {

            const confirmar = confirm(
                "Tem certeza que deseja excluir este atendimento?"
            );

            if (confirmar) {

                // Remove o registro da lista de dados.
                atendimentos = atendimentos.filter(function(item) {
                    return item.id !== atendimento.id;
                });

                // Salva a lista sem o atendimento excluído.
                salvarAtendimentos();

                // Atualiza a tela e os indicadores.
                renderizarAtendimentos();
                atualizarIndicadores();
            }

        });

        novoAtendimento.appendChild(botaoExcluir);

        // Adiciona o atendimento à lista do HTML.
        lista.appendChild(novoAtendimento);

    });

    // Atualiza os filtros depois de exibir os registros.
    aplicarFiltros();
}


// ==========================================
// 9. CADASTRAR NOVO ATENDIMENTO
// ==========================================

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    // Recupera os valores preenchidos no formulário.
    const paciente = document.getElementById("paciente").value.trim();
    const idade = document.getElementById("idade").value;
    const tarefa = document.getElementById("tarefa").value.trim();
    const categoria = document.getElementById("categoria").value;
    const prioridade = document.getElementById("prioridade").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const pagamento = document.getElementById("pagamento").value;

    // Verifica se todos os campos foram preenchidos.
    if (
        paciente === "" ||
        idade === "" ||
        tarefa === "" ||
        categoria === "" ||
        prioridade === "" ||
        data === "" ||
        horario === "" ||
        pagamento === ""
    ) {
        alert("Preencha todos os campos!");
        return;
    }

    // Cria um objeto com os dados do novo atendimento.
    const novoRegistro = {
        id: Date.now(),
        paciente: paciente,
        idade: idade,
        tarefa: tarefa,
        categoria: categoria,
        prioridade: prioridade,
        data: data,
        horario: horario,
        pagamento: pagamento,
        concluida: false
    };

    // Adiciona o novo atendimento à lista.
    atendimentos.push(novoRegistro);

    // Salva os dados no navegador.
    salvarAtendimentos();

    // Atualiza a lista e os indicadores.
    renderizarAtendimentos();
    atualizarIndicadores();

    // Limpa os campos do formulário.
    formulario.reset();

});


// ==========================================
// 10. INICIALIZAR A APLICAÇÃO
// ==========================================

// Exibe os atendimentos salvos quando a página é aberta.
renderizarAtendimentos();

// Atualiza os indicadores iniciais.
atualizarIndicadores();
```