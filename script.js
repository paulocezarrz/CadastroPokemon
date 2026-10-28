const form = document.querySelector("#IdFormulario");
const feedback = document.querySelector("#IdFeedback");
const nome = document.querySelector("#nome");
const botaolimpar = document.querySelector("#botaolimpar");
const botaoenviar = document.querySelector("#botao");
const listaCards = document.querySelector("#lista-cards");
const CP = document.querySelector("#IDcp");
const treinador = document.querySelector("#Dtreinador");

// Pegando os novos campos
const inputTipo = document.querySelector("#tipo");
const inputUrl = document.querySelector("#IDUrl");

const URL_POKEAPI = "https://pokeapi.co/api/v2/pokemon";

function pegarCorDoTipo(nomeTipo) {
    if (nomeTipo == "fire") {
        return "#e25822";
    } else if (nomeTipo == "water") {
        return "#2980d9";
    } else if (nomeTipo == "grass") {
        return "#3a9d3a";
    } else if (nomeTipo == "electric") {
        return "#d4a800";
    } else if (nomeTipo == "poison") {
        return "#8e44ad";
    } else if (nomeTipo == "normal") {
        return "#7f8c8d";
    } else {
        return "#555555";
    }
}

async function buscarDadosPokemon(nomePokemon) {
    const nomeFormatado = nomePokemon.trim().toLowerCase();

    try {
        const resposta = await fetch(`${URL_POKEAPI}/${nomeFormatado}`);

        if (!resposta.ok) {
            return null;
        }

        const dados = await resposta.json();
        return dados;
    } catch (error) {
        return null;
    }
}

// Quando o usuário digitar no campo de nome
nome.addEventListener("input", async function () {
    const valornome = nome.value.trim();

    if (valornome.length < 3) {
        feedback.textContent = "Deve conter ao menos 3 caracteres";
        feedback.style.color = "#FF0000";
        inputTipo.value = "";
        inputUrl.value = "";
        return;
    }

    feedback.textContent = "Buscando Pokémon...";
    feedback.style.color = "#FFA500";

    const dadosAPI = await buscarDadosPokemon(valornome);

    if (dadosAPI != null) {
        inputUrl.value = dadosAPI.sprites.other["official-artwork"].front_default;

        let tiposJuntos = "";

        for (let i = 0; i < dadosAPI.types.length; i++) {
            if (i > 0) {
                tiposJuntos = tiposJuntos + ", ";
            }

            tiposJuntos = tiposJuntos + dadosAPI.types[i].type.name;
        }

        inputTipo.value = tiposJuntos;

        feedback.textContent = "Pokémon encontrado!";
        feedback.style.color = "#00FF00";
    } else {
        feedback.textContent = "Pokémon não encontrado!";
        feedback.style.color = "#FF0000";
        inputTipo.value = "";
        inputUrl.value = "";
    }
});

function removercard(idPokemon) {
    const card = document.getElementById(idPokemon);
    card.remove();
}

// Cria o card do Pokémon
function criarCardPokemon(dados) {
    const imagem = dados.sprites.other["official-artwork"].front_default;
    const nomePokemon = dados.name;
    const id = dados.id;
    const CPt = Number(CP.value);
    const nomeTreinador = treinador.value.trim();

    let tiposFormatados = "";

    for (let i = 0; i < dados.types.length; i++) {
        if (i > 0) {
            tiposFormatados = tiposFormatados + ", ";
        }

        tiposFormatados = tiposFormatados + dados.types[i].type.name;
    }

    const card = document.createElement("div");
    card.classList.add("card-pokemon");

    

    if (dados.types.length >= 2) {
        const cor1 = pegarCorDoTipo(dados.types[0].type.name);
        const cor2 = pegarCorDoTipo(dados.types[1].type.name);
        card.style.background = `linear-gradient(${cor1}, ${cor2})`;
    } else {
        const corUnica = pegarCorDoTipo(dados.types[0].type.name);
        card.style.background = corUnica;
    }

    card.innerHTML = `
        <img src="${imagem}" alt="${nomePokemon}">
        <h2>Nome: ${nomePokemon}</h2>
        <h2>Tipo: ${tiposFormatados}</h2>
        <h2>CP: ${CPt || "Não informado"}</h2>
        <h2>Treinador: ${nomeTreinador || "Sem treinador"}</h2>
        <button class="close" onclick="removercard(${id}")">X</button>
    `;

    card.setAttribute("id", id);
    listaCards.appendChild(card);
}

// Quando o formulário for enviado
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nivel = Number(document.querySelector("#IDnivel").value);

    if (nome.value.trim().length < 3) {
        feedback.textContent = "Deve conter ao menos 3 caracteres";
        feedback.style.color = "#FF0000";
        return;
    }

    if (nivel < 100) {
        feedback.textContent = "Nível muito baixo. Deve ser maior que 100.";
        feedback.style.color = "#FF0000";
        return;
    }

    const dadosAPI = await buscarDadosPokemon(nome.value);

    if (dadosAPI == null) {
        feedback.textContent = "Pokémon não encontrado!";
        feedback.style.color = "#FF0000";
        return;
    }

    const cards = listaCards.querySelectorAll(".card-pokemon");

    let tem = Array.from(cards).some(card => {
        return card.id == dadosAPI.id;
    });

    if (tem === false) {
        criarCardPokemon(dadosAPI);

        feedback.textContent = "Pokémon cadastrado!";
        feedback.style.color = "#00FF00";

        nome.value = "";
        inputTipo.value = "";
        inputUrl.value = "";
        document.querySelector("#IDnivel").value = "";
        CP.value = "";
        treinador.value = "";
    } else {
        feedback.textContent = "Esse Pokémon já está cadastrado!";
        feedback.style.color = "#FF0000";
    }
});


botaolimpar.addEventListener("click", function () {
    feedback.textContent = "Formulário limpo.";
    feedback.style.color = "#00FF00";
});