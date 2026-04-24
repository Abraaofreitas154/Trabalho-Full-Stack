const Produto = require('../models/Produto');

// Criar produto
exports.criarProduto = async (req, res) => {
  try {
    const produto = await Produto.create(req.body);
    res.status(201).json({ sucesso: true, data: produto });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
};

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ createdAt: -1 });
    res.status(200).json({ sucesso: true, data: produtos });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
};

// Buscar produto por ID
exports.buscarProduto = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
    }
    res.status(200).json({ sucesso: true, data: produto });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
};

// Atualizar produto
exports.atualizarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!produto) {
      return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
    }
    res.status(200).json({ sucesso: true, data: produto });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
};

// Deletar produto
exports.deletarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) {
      return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
    }
    res.status(200).json({ sucesso: true, mensagem: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
};

