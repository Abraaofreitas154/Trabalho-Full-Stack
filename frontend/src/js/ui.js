// UI Helpers
var $ = function(id) {
  return document.getElementById(id);
};

function showMensagem(texto, tipo) {
  if (tipo === undefined) tipo = 'success';
  const el = $('mensagem');
  el.textContent = texto;
  el.className = 'mensagem ' + tipo;
  el.classList.remove('hidden');
  setTimeout(() => {
    el.classList.add('hidden');
  }, 3000);
}

function showErro(id, texto) {
  const el = $(id);
  el.textContent = texto;
  el.classList.remove('hidden');
  setTimeout(() => {
    el.classList.add('hidden');
  }, 4000);
}

function hideErro(id) {
  $(id).classList.add('hidden');
}

var formatarMoeda = function(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

var formatarData = function(data) {
  return new Date(data).toLocaleDateString('pt-BR');
};

function setLoading(id, mostrar) {
  const el = $(id);
  if (mostrar) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

var criarItemHTML = function(item, tipo) {
  const isProduto = tipo === 'produto';
  const preco = isProduto ? formatarMoeda(item.preco) : '';
  const badgeClass = item.ativo ? 'badge-ativo' : 'badge-inativo';
  const badgeText = item.ativo ? 'Ativo' : 'Inativo';

  let meta = '';
  if (isProduto) {
    meta = `Categoria: ${item.categoria || 'Geral'} | Qtd: ${item.quantidade}`;
  } else {
    meta = item.email || '';
    if (item.telefone) meta += (meta ? ' | ' : '') + item.telefone;
  }

  const descricao = isProduto ? (item.descricao || '') : (item.endereco || '');

  return `
    <div class="item" data-id="${item._id}">
      <div class="item-info">
        <h3>${escapeHtml(item.nome)} <span class="badge ${badgeClass}">${badgeText}</span></h3>
        ${descricao ? `<p>${escapeHtml(descricao)}</p>` : ''}
        <div class="item-meta">${escapeHtml(meta)}</div>
      </div>
      ${isProduto ? `<div class="item-preco">${preco}</div>` : ''}
      <div class="item-acoes">
        <button class="btn btn-success btn-editar" data-id="${item._id}" data-tipo="${tipo}">Editar</button>
        <button class="btn btn-danger btn-excluir" data-id="${item._id}" data-tipo="${tipo}">Excluir</button>
      </div>
    </div>
  `;
}

var escapeHtml = function(text) {
  if (!text) return '';
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

var renderizarLista = function(containerId, itens, tipo) {
  const container = $(containerId);
  if (!itens || itens.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Nenhum ${tipo} cadastrado ainda.</p>
        <p>Adicione seu primeiro ${tipo} usando o formulário acima!</p>
      </div>
    `;
    return;
  }
  container.innerHTML = itens.map(item => criarItemHTML(item, tipo)).join('');
}

var atualizarContador = function(id, total) {
  $(id).textContent = '(' + total + ')';
};

