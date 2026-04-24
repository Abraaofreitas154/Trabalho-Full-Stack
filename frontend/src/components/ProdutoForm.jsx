import { useState, useEffect } from 'react';

const INITIAL_STATE = {
  nome: '',
  descricao: '',
  preco: '',
  quantidade: '',
  categoria: 'Geral',
  ativo: true,
};

export default function ProdutoForm({ onSalvar, produtoEditando, onCancelar }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (produtoEditando) {
      setForm({
        nome: produtoEditando.nome || '',
        descricao: produtoEditando.descricao || '',
        preco: produtoEditando.preco || '',
        quantidade: produtoEditando.quantidade || '',
        categoria: produtoEditando.categoria || 'Geral',
        ativo: produtoEditando.ativo !== undefined ? produtoEditando.ativo : true,
      });
    } else {
      setForm(INITIAL_STATE);
    }
  }, [produtoEditando]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (!form.nome.trim()) {
      setErro('O nome do produto é obrigatório.');
      return;
    }
    if (!form.preco || Number(form.preco) < 0) {
      setErro('O preço deve ser maior ou igual a zero.');
      return;
    }
    if (form.quantidade === '' || Number(form.quantidade) < 0) {
      setErro('A quantidade deve ser maior ou igual a zero.');
      return;
    }

    onSalvar({
      ...form,
      preco: Number(form.preco),
      quantidade: Number(form.quantidade),
    });
    setForm(INITIAL_STATE);
  };

  return (
    <div className="card">
      <h2>{produtoEditando ? 'Editar Produto' : 'Novo Produto'}</h2>
      {erro && <div className="error">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome do produto" />
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows="3" placeholder="Descrição do produto" />
        </div>
        <div className="form-group">
          <label>Preço (R$)</label>
          <input name="preco" type="number" step="0.01" value={form.preco} onChange={handleChange} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Quantidade</label>
          <input name="quantidade" type="number" value={form.quantidade} onChange={handleChange} placeholder="0" />
        </div>
        <div className="form-group">
          <label>Categoria</label>
          <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoria" />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input name="ativo" type="checkbox" checked={form.ativo} onChange={handleChange} id="ativo" />
          <label htmlFor="ativo" style={{ margin: 0 }}>Ativo</label>
        </div>
        <button type="submit" className="btn btn-primary">
          {produtoEditando ? 'Atualizar' : 'Cadastrar'}
        </button>
        {produtoEditando && (
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}

