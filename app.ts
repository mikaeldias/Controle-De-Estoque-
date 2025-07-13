interface Produto {
    id: number; // Id único em cada Produto, auto incrementado
    nome: string; // Nome do produto
    quantidade: number; // Quantidade
}

const estoqueProduto = new Map<number, Produto>(); // Armazena o Produto e usa o id como chave(number)

// Contador para gerar id's
let addId = 1;

// DOM
// Add Produto

function addProduto(event: Event): void {
    event.preventDefault(); // Assegura que usuário não recarregue a página

    const nomeProdutoInput = document.getElementById('NomeProduto') as HTMLInputElement; // armazena o nome do produto na variavel
    const quantidadeProdutoInput = document.getElementById('QuantidadeProduto') as HTMLInputElement;// armazena o quantidade do produto na variavel

    const nome = nomeProdutoInput.value.trim(); // Trim() remove espaços antes ou dps do dado
    const quantidade = parseInt(quantidadeProdutoInput.value.trim()); // defininindo o valor como number

    // Válidação da entrada de dados
    if (!nome || isNaN(quantidade) || quantidade < 0) { // 
        console.error('Erro: Por favor, preencha o Nome do Produto e uma Quantidade válida.')
        return;
    }
    // gera ID Auto incrementável
    const id = addId;
    addId++;

    // Cria novo produto e amazena no Map
    const novoProduto: Produto = {id, nome, quantidade};
    estoqueProduto.set(id, novoProduto);

    // Limpa formulário
    nomeProdutoInput.value = '';
    quantidadeProdutoInput.value = '';
}

// Busca produtos
function buscaProdutos(): void {
    const buscaProdutoInput = document.getElementById('procuraProdutoId') as HTMLInputElement;
    const buscaResultadoDiv = document.getElementById('resultadosPesquisa') as HTMLInputElement;

    const idString = buscaProdutoInput.value.trim();
    const id = parseInt(idString);

    if (!idString || isNaN(id)) {
        console.error('Erro: Por favor, digite um ID numérico de produto para buscar.');
        buscaResultadoDiv.classList.add('hidden');
        return;
    }

    const produto = estoqueProduto.get(id); // Busca produto no Map

    if (produto) {
        buscaResultadoDiv.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Produto Encontrado:</h3>
            <p><strong>ID:</strong> ${produto.id}</p>
            <p><strong>Nome:</strong> ${produto.nome}</p>
            <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
        `;
        buscaResultadoDiv.classList.remove('hidden');
        console.warn(`Produto com ID "${id}" encontrado.`);
    }else {
        buscaResultadoDiv.innerHTML = `<p class="text-red-600">Produto com ID "${id}" não encontrado.</p>`;
        buscaResultadoDiv.classList.remove('hidden');
        console.warn(`Produto com ID "${id}" encontrado.`);
    }
}

// Lista Produtos
function listaTodosProdutos(): void {
    const produtolistDiv = document.getElementById('produtoLista') as HTMLDivElement;
    const naoTemProduto = document.getElementById('nãotemProduto') as HTMLParagraphElement;
    produtolistDiv.innerHTML = ''; // Limpa lista atual

    if (estoqueProduto.size === 0) {
        naoTemProduto.classList.remove('hidden');
        return;

    } else {
        naoTemProduto.classList.add('hidden');
    }
    estoqueProduto.forEach(produto => {
        const cardProduto = document.createElement('div');
        cardProduto.className = 'product-card bg-white border border-gray-300 rounded-lg p-4 shadow-sm';
        cardProduto.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${produto.nome}</h3>
            <p class="text-sm text-gray-600"><strong>ID:</strong> ${produto.id}</p>
            <p class="text-sm text-gray-600"><strong>Quantidade:</strong> ${produto.quantidade}</p>
        `;
        produtolistDiv.appendChild(cardProduto);
    });
}

// Remover Produto
function removerProduto(): void {
    const removerProdutoInput = document.getElementById('removerProdutoId') as HTMLInputElement;
    const removerResultado = document.getElementById('removerResultados') as HTMLDivElement;

    const idStr = removerProdutoInput.value.trim();
    const id = parseInt(idStr); // transformando o idStr em number

    if (!idStr || isNaN(id)) {
        console.error('Erro: Por favor, digite um ID numérico de produto para remover.');
        removerResultado.classList.add('hidden');
        return;
    }

    if (estoqueProduto.delete(id)) {
        removerResultado.innerHTML = `<p class="text-green-600">Produto com ID "${id}" removido com sucesso.</p>`;
        removerResultado.classList.remove('hidden');
        removerProdutoInput.value = '';
        listaTodosProdutos(); // atualiza lista
    } else {
        removerResultado.innerHTML = `<p class="text-red-600">Produto com ID "${id}" não encontrado para remoção.</p>`;
        removerResultado.classList.remove('hidden');
        console.warn(`Produto com ID "${id}" não encontrado para remoção.`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    function setupEventListener<T extends HTMLElement>(elementId: string, eventType: string, handler: (event: Event) => void): void {
        const element = document.getElementById(elementId) as T;
        if (element) {
            element.addEventListener(eventType, handler);
        }
    }
    setupEventListener('addProductForm', 'submit', addProduto);
    setupEventListener('searchProductBtn', 'click', buscaProdutos);
    setupEventListener('listProductsBtn', 'click', listaTodosProdutos);
    setupEventListener('removeProductBtn', 'click', removerProduto);
});