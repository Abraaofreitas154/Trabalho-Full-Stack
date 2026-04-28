const fs = require('fs');
const content = `import { useState, useEffect } from 'react';
import api from '../api/api';

function ProdutoManager() {
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', quantidade: '', categoria: 'Geral', ativo: true });

  useEffect(() => { carregar(); }, []);

  const showMsg = (texto, tipo = 'success') => { setMsg({ texto, tipo }); setTimeout(() => setMsg(''), 3000); };

  async function carregar() {
    setLoading(true);
    try { const res = await api.get('/produtos'); setProdutos(res.data || []); }
    catch (err) { showMsg('Erro: ' + err.message, 'error'); }
    finally { setLoading(false); }
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault(); setErro('');
    const nome = form.nome.trim(), preco = parseFloat(form.preco), qtd = parseInt(form.quantidade);
    if (!nome) { setErro('Nome obrigatório'); return; }
    if (isNaN(preco) || preco < 0) { setErro('Preço inválido'); return; }
    if (isNaN(qtd) || qtd < 0) { setErro('Quantidade inválida'); return; }
    const dados = { nome, descricao: form.descricao.trim(), preco, quantidade: qtd, categoria: form.categoria.trim() || 'Geral', ativo: form.ativo };
    try {
      if (editando) { await api.put('/produtos/' + editando, dados); showMsg('Atualizado!'); }
      else { await api.post('/produtos', dados); showMsg('Cadastrado!'); }
      reset(); carregar();
    } catch (err) { setErro(err.message); }
  }

  function reset() { setForm({ nome: '', descricao: '', preco: '', quantidade: '', categoria: 'Geral', ativo: true }); setEditando(null); setErro(''); }

  async function editar(id) {
    try { const r = await api.get('/produtos/' + id); const p = r.data;
      setForm({ nome: p.nome, descricao: p.descricao || '', preco: p.preco, quantidade: p.quantidade, categoria: p.categoria || 'Geral', ativo: p.ativo });
      setEditando(id);
    } catch (err) { showMsg('Erro: ' + err.message, 'error'); }
  }

  async function excluir(id) {
    if (!confirm('Excluir?')) return;
    try { await api.delete('/produtos/' + id); showMsg('Excluído!'); carregar(); }
    catch (err) { showMsg('Erro: ' + err.message, 'error'); }
  }

  const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <section className="tab-content active">
      {msg && <div className={'mensagem ' + msg.tipo}>{msg.texto}</div>}
      <div className="card">
        <h2>{editando ? 'Editar Produto' : 'Novo Produto'}</h2>
        {erro && <div className="error">{erro}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group"><label>Nome *</label><input name="nome" value={form.nome} onChange={onChange} required /></div>
          <div className="form-group"><label>Descrição</label><textarea name="descricao" value={form.descricao} onChange={onChange} rows="2" /></div>
          <div className="form-row">
            <div className="form-group"><label>Preço *</label><input type="number" name="preco" value={form.preco} onChange={onChange} step="0.01" required /></div>
            <div className="form-group"><label>Qtd *</label><input type="number" name="quantidade" value={form.quantidade} onChange={onChange} required /></div>
          <div className="form-group"><label>Categoria</label><input name="categoria" value={form.categoria} onChange={onChange} /></div>
          <div className="form-group checkbox-group"><input type="checkbox" name="ativo" checked={form.ativo} onChange={onChange} /><label>Ativo</label></div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editando ? 'Atualizar' : 'Cadastrar'}</button>
            {editando && <button type="button" className="btn btn-secondary" onClick={reset}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <h2>Produtos ({produtos.length})</h2>
        {loading && <div className="loading">Carregando...</div>}
        <div className="lista">
          {produtos.length === 0 ? <div className="empty-state"><p>Nenhum produto.</p></div> :
            produtos.map(p => (
              <div className="item" key={p._id}>
                <div className="item-info">
                  <h3>{p.nome} <span className={'badge ' + (p.ativo ? 'badge-ativo' : 'badge-inativo')}>{p.ativo ? 'Ativo' : 'Inativo'}</span></h3>
                  {p.descricao && <p>{p.descricao}</p>}
                  <div className="item-meta">Cat: {p.categoria || 'Geral'} | Qtd: {p.quantidade}</div>
                <div className="item-preco">{fmt(p.preco)}</div>
                <div className="item-acoes">
                  <button className="btn btn-success" onClick={() => editar(p._id)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => excluir(p._id)}>Excluir</button>
                </div>
            ))
          }
        </div>
    </section>
  );
}

export default ProdutoManager;
`;
fs.writeFileSync('ProdutoManager.jsx', content, 'utf8');
console.log('OK');
