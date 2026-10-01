const campoPaciente = document.getElementById("paciente");
const campoIdade = document.getElementById("idade");
const campoTarefa = document.getElementById("tarefa");

const botao = document.getElementById("adicionar");
const lista = document.getElementById("lista");

botao.addEventListener("click", function() {

    const paciente = campoPaciente.value;
    const idade = campoIdade.value;
    const tarefa = campoTarefa.value;

    if (paciente === "" || idade === "" || tarefa === "") {
        alert("Preencha o nome do paciente, a idade e a tarefa!");
        return;
    }

    const item = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const informacoes = document.createElement("span");

    informacoes.textContent =
        "Paciente: " + paciente +
        " | Idade: " + idade +
        " | Tarefa: " + tarefa;

    checkbox.addEventListener("change", function() {

        if (checkbox.checked) {
            informacoes.style.textDecoration = "line-through";
        } else {
            informacoes.style.textDecoration = "none";
        }

    });

    item.appendChild(checkbox);
    item.appendChild(informacoes);

    lista.appendChild(item);

    campoTarefa.value = "";
});
