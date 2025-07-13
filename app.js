"use strict";
const estoqueProduto = new Map(); // Armazena o Produto e usa o id como chame(number)
// Contador par gerar id's
let addId = 1;
// DOM
// Add Produto
function addProduto(event) {
    event.preventDefault(); // Assegura que usuário não recarregue a página 
    const nomeProdutoInput = document.getElementById('NomeProduto'); // armazena o nome do produto na variavel
    const quantidadeProdutoInput = document.getElementById('QuantidadeProduto'); // armazena o quantidade do produto na variavel
    const nome = nomeProdutoInput.value.trim(); // Trim() remove espaços antes ou dps do dado
    const quantidade = parseInt(quantidadeProdutoInput.value.trim()); // defininindo o valor como number
    if (!nome || isNaN(quantidade) || quantidade < 0) {
        console.error('Erro: Por favor, preencha o Nome do Produto e uma Quantidade válida.');
        return;
    }
    // gera ID Auto incrementável
    const id = addId;
    addId++;
    // Cria novo produto
    const novoProduto = { id, nome, quantidade };
    estoqueProduto.set(id, novoProduto);
    console.log(`Produto "${nome}" (ID: ${id}) adicionado com sucesso!`);
    // Limpa formulário
    nomeProdutoInput.value = '';
    quantidadeProdutoInput.value = '';
    // atualiza lista de produtos após add
}
// Busca produtos
function buscaProdutos() {
    const buscaProdutoInput = document.getElementById('procuraProdutoId');
    const buscaResultadoDiv = document.getElementById('resultadosPesquisa');
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
    }
    else {
        buscaResultadoDiv.innerHTML = `<p class="text-red-600">Produto com ID "${id}" não encontrado.</p>`;
        buscaResultadoDiv.classList.remove('hidden');
        console.warn(`Produto com ID "${id}" encontrado.`);
    }
}
// Lista Produtos
function listaTodosProdutos() {
    const produtolistDiv = document.getElementById('produtoLista');
    const naoTemProduto = document.getElementById('nãotemProduto');
    produtolistDiv.innerHTML = ''; // Limpa lista atual
    if (estoqueProduto.size === 0) {
        naoTemProduto.classList.remove('hidden');
        return;
    }
    else {
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
    console.log('lista de produtos atualizada.');
}
// Remover Produto
function removerProduto() {
    const removerProdutoInput = document.getElementById('removerProdutoId');
    const removerResultado = document.getElementById('removerResults');
    const idStr = removerProdutoInput.value.trim();
    const id = parseInt(idStr); // transformando o idStr em int
    if (!idStr || isNaN(id)) {
        console.error('Erro: Por favor, digite um ID numérico de produto para remover.');
        removerResultado.classList.add('hidden');
        return;
    }
    if (estoqueProduto.delete(id)) {
        removerResultado.innerHTML = `<p class="text-green-600">Produto com ID "${id}" removido com sucesso.</p>`;
        removerResultado.classList.remove('hidden');
        console.log(`Produto com ID "${id}" removido com sucesso.`);
        removerProdutoInput.value = '';
        listaTodosProdutos(); // atualiza lista
    }
    else {
        removerResultado.innerHTML = `<p class="text-red-600">Produto com ID "${id}" não encontrado para remoção.</p>`;
        removerResultado.classList.remove('hidden');
        console.warn(`Produto com ID "${id}" não encontrado para remoção.`);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    function setupEventListener(elementId, eventType, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(eventType, handler);
        }
    }
    setupEventListener('addProductForm', 'submit', addProduto);
    setupEventListener('searchProductBtn', 'click', buscaProdutos);
    setupEventListener('listProductsBtn', 'click', listaTodosProdutos);
    setupEventListener('removeProductBtn', 'click', removerProduto);
});
