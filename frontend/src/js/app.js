// =====================
// ESTADO
// =====================
var produtoEditando = null;
var clienteEditando = null;

// =====================
// TABS
// =====================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    $(`tab-${tab}`).classList.add('active');
  });
});

// =====================
// PRODUTOS
// =====================

async function carregarProdutos() {
  setLoading('produto-loading', true);
  try {
    const res = await api.get('/produtos');
    const produtos = res.data || [];
    renderizarLista('produto-lista', produtos, 'produto');
    atualizarContador('produto-contador', produtos.length);
    bindAcoes('produto');
  } catch (err) {
    showMensagem('Erro ao carregar produtos: ' + err.message, 'error');
  } finally {
    setLoading('produto-loading', false);
  }
}

$('produto-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideErro('produto-erro');

  const nome = $('produto-nome').value.trim();
  const preco = parseFloat($('produto-preco').value);
  const quantidade = parseInt($('produto-quantidade').value);

  if (!nome) {
    showErro('produto-erro', 'O nome do produto é obrigatório.');
    return;
  }
  if (isNaN(preco) || preco < 0) {
    showErro('produto-erro', 'O preço deve ser maior ou igual a zero.');
    return;
  }
  if (isNaN(quantidade) || quantidade < 0) {
    showErro('produto-erro', 'A quantidade deve ser maior ou igual a zero.');
    return;
  }

  const dados = {
    nome,
    descricao: $('produto-descricao').value.trim(),
    preco,
    quantidade,
    categoria: $('produto-categoria').value.trim() || 'Geral',
    ativo: $('produto-ativo').checked,
  };

  try {
    if (produtoEditando) {
      await api.put(`/produtos/${produtoEditando}`, dados);
      showMensagem('Produto atualizado com sucesso!');
    } else {
      await api.post('/produtos', dados);
      showMensagem('Produto cadastrado com sucesso!');
    }
    resetFormProduto();
    carregarProdutos();
  } catch (err) {
    showErro('produto-erro', err.message);
  }
});

$('produto-cancelar').addEventListener('click', resetFormProduto);

function resetFormProduto() {
  $('produto-form').reset();
  $('produto-id').value = '';
  produtoEditando = null;
  $('produto-titulo').textContent = 'Novo Produto';
  $('produto-submit').textContent = 'Cadastrar';
  $('produto-cancelar').classList.add('hidden');
  hideErro('produto-erro');
}

function editarProduto(id) {
  api.get(`/produtos/${id}`).then(res => {
    const p = res.data;
    $('produto-nome').value = p.nome;
    $('produto-descricao').value = p.descricao || '';
    $('produto-preco').value = p.preco;
    $('produto-quantidade').value = p.quantidade;
    $('produto-categoria').value = p.categoria || 'Geral';
    $('produto-ativo').checked = p.ativo;
    produtoEditando = id;
    $('produto-titulo').textContent = 'Editar Produto';
    $('produto-submit').textContent = 'Atualizar';
    $('produto-cancelar').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }).catch(err => {
    showMensagem('Erro ao carregar produto: ' + err.message, 'error');
  });
}

function excluirProduto(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;
  api.delete(`/produtos/${id}`).then(() => {
    showMensagem('Produto excluído com sucesso!');
    carregarProdutos();
  }).catch(err => {
    showMensagem('Erro ao excluir produto: ' + err.message, 'error');
  });
}

// =====================
// CLIENTES
// =====================

async function carregarClientes() {
  setLoading('cliente-loading', true);
  try {
    const res = await api.get('/clientes');
    const clientes = res.data || [];
    renderizarLista('cliente-lista', clientes, 'cliente');
    atualizarContador('cliente-contador', clientes.length);
    bindAcoes('cliente');
  } catch (err) {
    showMensagem('Erro ao carregar clientes: ' + err.message, 'error');
  } finally {
    setLoading('cliente-loading', false);
  }
}

$('cliente-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideErro('cliente-erro');

  const nome = $('cliente-nome').value.trim();
  const email = $('cliente-email').value.trim();

  if (!nome) {
    showErro('cliente-erro', 'O nome do cliente é obrigatório.');
    return;
  }
  if (!email) {
    showErro('cliente-erro', 'O e-mail é obrigatório.');
    return;
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    showErro('cliente-erro', 'Por favor, informe um e-mail válido.');
    return;
  }

  const dados = {
    nome,
    email: email.toLowerCase(),
    telefone: $('cliente-telefone').value.trim(),
    endereco: $('cliente-endereco').value.trim(),
    ativo: $('cliente-ativo').checked,
  };

  try {
    if (clienteEditando) {
      await api.put(`/clientes/${clienteEditando}`, dados);
      showMensagem('Cliente atualizado com sucesso!');
    } else {
      await api.post('/clientes', dados);
      showMensagem('Cliente cadastrado com sucesso!');
    }
    resetFormCliente();
    carregarClientes();
  } catch (err) {
    showErro('cliente-erro', err.message);
  }
});

$('cliente-cancelar').addEventListener('click', resetFormCliente);

function resetFormCliente() {
  $('cliente-form').reset();
  $('cliente-id').value = '';
  clienteEditando = null;
  $('cliente-titulo').textContent = 'Novo Cliente';
  $('cliente-submit').textContent = 'Cadastrar';
  $('cliente-cancelar').classList.add('hidden');
  hideErro('cliente-erro');
}

function editarCliente(id) {
  api.get(`/clientes/${id}`).then(res => {
    const c = res.data;
    $('cliente-nome').value = c.nome;
    $('cliente-email').value = c.email;
    $('cliente-telefone').value = c.telefone || '';
    $('cliente-endereco').value = c.endereco || '';
    $('cliente-ativo').checked = c.ativo;
    clienteEditando = id;
    $('cliente-titulo').textContent = 'Editar Cliente';
    $('cliente-submit').textContent = 'Atualizar';
    $('cliente-cancelar').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }).catch(err => {
    showMensagem('Erro ao carregar cliente: ' + err.message, 'error');
  });
}

function excluirCliente(id) {
  if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
  api.delete(`/clientes/${id}`).then(() => {
    showMensagem('Cliente excluído com sucesso!');
    carregarClientes();
  }).catch(err => {
    showMensagem('Erro ao excluir cliente: ' + err.message, 'error');
  });
}

// =====================
// AÇÕES (delegação de eventos)
// =====================

function bindAcoes(tipo) {
  const container = tipo === 'produto' ? 'produto-lista' : 'cliente-lista';
  const lista = $(container);
  
  lista.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const t = btn.dataset.tipo;
      if (t === 'produto') editarProduto(id);
      else editarCliente(id);
    });
  });
  
  lista.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const t = btn.dataset.tipo;
      if (t === 'produto') excluirProduto(id);
      else excluirCliente(id);
    });
  });
}

// =====================
// INICIALIZAÇÃO
// =====================

document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
  carregarClientes();
});

