const formulario = document.getElementById("form-atendimento");
const lista = document.getElementById("lista");

const totalTarefas = document.getElementById("total-tarefas");
const tarefasPendentes = document.getElementById("tarefas-pendentes");
const tarefasConcluidas = document.getElementById("tarefas-concluidas");


function atualizarIndicadores() {

    const atendimentos = lista.querySelectorAll("li:not(#mensagem-vazia)");
    const concluidos = lista.querySelectorAll("li.concluida");

    totalTarefas.textContent = atendimentos.length;
    tarefasConcluidas.textContent = concluidos.length;
    tarefasPendentes.textContent =
        atendimentos.length - concluidos.length;
}


formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const paciente = document.getElementById("paciente").value;
    const idade = document.getElementById("idade").value;
    const tarefa = document.getElementById("tarefa").value;
    const categoria = document.getElementById("categoria").value;
    const prioridade = document.getElementById("prioridade").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const pagamento = document.getElementById("pagamento").value;


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


    const novoAtendimento = document.createElement("li");


    novoAtendimento.innerHTML = `
        <strong>Paciente:</strong> ${paciente}<br>
        <strong>Idade:</strong> ${idade} anos<br>
        <strong>Tarefa:</strong> ${tarefa}<br>
        <strong>Categoria:</strong> ${categoria}<br>
        <strong>Prioridade:</strong> ${prioridade}<br>
        <strong>Data da consulta:</strong> ${data}<br>
        <strong>Horário:</strong> ${horario}<br>
        <strong>Pagamento:</strong> ${pagamento}<br>

        <button class="btn-concluir">
            Concluir atendimento
        </button>
    `;


    lista.appendChild(novoAtendimento);


    const botaoConcluir =
        novoAtendimento.querySelector(".btn-concluir");


    botaoConcluir.addEventListener("click", function() {

        novoAtendimento.classList.toggle("concluida");


        if (novoAtendimento.classList.contains("concluida")) {

            botaoConcluir.textContent =
                "Reabrir atendimento";

        } else {

            botaoConcluir.textContent =
                "Concluir atendimento";
        }


        atualizarIndicadores();
    });


    atualizarIndicadores();

    formulario.reset();

});