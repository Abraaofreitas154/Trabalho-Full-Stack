const Cliente = require('../models/Cliente');

// Criar cliente
exports.criarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json({ sucesso: true, data: cliente });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ sucesso: false, erro: 'E-mail já cadastrado' });
    }
    res.status(400).json({ sucesso: false, erro: error.message });
  }
};

// Listar todos os clientes
exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.status(200).json({ sucesso: true, data: clientes });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
};

// Buscar cliente por ID
exports.buscarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
    }
    res.status(200).json({ sucesso: true, data: cliente });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
};

// Atualizar cliente
exports.atualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cliente) {
      return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
    }
    res.status(200).json({ sucesso: true, data: cliente });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ sucesso: false, erro: 'E-mail já cadastrado' });
    }
    res.status(400).json({ sucesso: false, erro: error.message });
  }
};

// Deletar cliente
exports.deletarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
    }
    res.status(200).json({ sucesso: true, mensagem: 'Cliente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
};
