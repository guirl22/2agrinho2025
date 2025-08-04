// Dicionários de itens com seus valores
const itensCampo = {
    "milho": { valor: 5, emoji: "🌽" },
    "leite": { valor: 10, emoji: "🥛" },
    "ovos": { valor: 8, emoji: "🥚" }
};

const itensCidade = {
    "computador": { valor: 50, emoji: "💻" },
    "celular": { valor: 30, emoji: "📱" },
    "roupa": { valor: 15, emoji: "👕" }
};

// Inventário do jogador
let inventario = {
    "milho": 0,
    "leite": 0,
    "ovos": 0
};

let pontos = 0;

// Elementos do DOM
const campoItensDiv = document.getElementById("campo-itens");
const cidadeItensDiv = document.getElementById("cidade-itens");
const inventarioItensDiv = document.getElementById("inventario-itens");
const pontosSpan = document.getElementById("pontos");
const coletarBtn = document.getElementById("coletar-btn");

// Funções do jogo
function renderizarInventario() {
    inventarioItensDiv.innerHTML = "";
    for (const item in inventario) {
        const p = document.createElement("p");
        p.textContent = `${itensCampo[item].emoji} ${item.charAt(0).toUpperCase() + item.slice(1)}: ${inventario[item]}`;
        inventarioItensDiv.appendChild(p);
    }
    pontosSpan.textContent = pontos;
}

function renderizarCampoItens() {
    campoItensDiv.innerHTML = "";
    for (const item in itensCampo) {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `${itensCampo[item].emoji}<br>${item.charAt(0).toUpperCase() + item.slice(1)}`;
        div.dataset.item = item;
        campoItensDiv.appendChild(div);
    }
}

function renderizarCidadeItens() {
    cidadeItensDiv.innerHTML = "";
    for (const item in itensCidade) {
        const div = document.createElement("div");
        div.classList.add("item", "cidade");
        div.innerHTML = `${itensCidade[item].emoji}<br>${item.charAt(0).toUpperCase() + item.slice(1)}<br>Custa: ${itensCidade[item].valor}`;
        div.dataset.item = item;
        div.addEventListener("click", () => trocarItem(item));
        cidadeItensDiv.appendChild(div);
    }
}

function coletarItens() {
    const itens = Object.keys(itensCampo);
    for (let i = 0; i < 3; i++) { // Coleta 3 itens por vez
        const itemColetado = itens[Math.floor(Math.random() * itens.length)];
        inventario[itemColetado]++;
        pontos += itensCampo[itemColetado].valor;
    }
    renderizarInventario();
}

function trocarItem(itemCidade) {
    const valorTroca = itensCidade[itemCidade].valor;
    if (pontos >= valorTroca) {
        pontos -= valorTroca;
        alert(`Parabéns! Você adquiriu 1 ${itemCidade.charAt(0).toUpperCase() + itemCidade.slice(1)}!`);
        // Aqui você poderia adicionar o item ao inventário, se quisesse
    } else {
        alert(`Você precisa de ${valorTroca} pontos para trocar por 1 ${itemCidade}. Você tem ${pontos} pontos.`);
    }
    renderizarInventario();
}

// Eventos
coletarBtn.addEventListener("click", coletarItens);

// Início do jogo
renderizarCampoItens();
renderizarCidadeItens();
renderizarInventario();