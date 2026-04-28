const fs = require('fs');
const content = `import { useState, useEffect } from 'react';
import api from '../api/api';

function ClienteManager() {
  const [clientes, setClientes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', endereco: '', ativo: true });

  useEffect(() => { carregar(); }, []);

  const showMsg = (texto, tipo = 'success') => { setMsg({ texto, tipo }); setTimeout(() => setMsg(''), 3000); };

  async function carregar() {
    setLoading(true);
    try { const res = await api.get('/clientes'); setClientes(res.data || []); }
    catch (err) { showMsg('Erro: ' + err.message, 'error'); }
    finally { setLoading(false); }
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault(); setErro('');
    const nome = form.nome.trim(), email = form.email.trim();
    if (!nome) { setErro('Nome obrigatório'); return; }
    if (!email) { setErro('E-mail obrigatório'); return; }
    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) { setErro('E-mail inválido'); return; }
    const dados = { nome, email: email.toLowerCase(), telefone: form.telefone.trim(), endereco: form.endereco.trim(), ativo: form.ativo };
    try {
      if (editando) { await api.put('/clientes/' + editando, dados); showMsg('Atualizado!'); }
      else { await api.post('/clientes', dados); showMsg('Cadastrado!'); }
      reset(); carregar();
    } catch (err) { setErro(err.message); }
  }

  function reset() { setForm({ nome: '', email: '', telefone: '', endereco: '', ativo: true }); setEditando(null); setErro(''); }

  async function editar(id) {
    try { const r = await api.get('/clientes/' + id); const c = r.data;
      setForm({ nome: c.nome, email: c.email, telefone: c.telefone || '', endereco: c.endereco || '', ativo: c.ativo });
      setEditando(id);
    } catch (err) { showMsg('Erro: ' + err.message, 'error'); }
  }

  async function excluir(id) {
    if (!confirm('Excluir?')) return;
    try { await api.delete('/clientes/' + id); showMsg('Excluído!'); carregar(); }
    catch (err) { showMsg('Erro: ' + err.message, 'error'); }
  }

  return (
    <section className="tab-content active">
      {msg && <div className={'mensagem ' + msg.tipo}>{msg.texto}</div>}
      <div className="card">
        <h2>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        {erro && <div className="error">{erro}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group"><label>Nome *</label><input name="nome" value={form.nome} onChange={onChange} required /></div>
          <div className="form-group"><label>E-mail *</label><input type="email" name="email" value={form.email} onChange={onChange} required /></div>
          <div className="form-group"><label>Telefone</label><input name="telefone" value={form.telefone} onChange={onChange} /></div>
          <div className="form-group"><label>Endereço</label><textarea name="endereco" value={form.endereco} onChange={onChange} rows="2" /></div>
          <div className="form-group checkbox-group"><input type="checkbox" name="ativo" checked={form.ativo} onChange={onChange} /><label>Ativo</label></div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editando ? 'Atualizar' : 'Cadastrar'}</button>
            {editando && <button type="button" className="btn btn-secondary" onClick={reset}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <h2>Clientes ({clientes.length})</h2>
        {loading && <div className="loading">Carregando...</div>}
        <div className="lista">
          {clientes.length === 0 ? <div className="empty-state"><p>Nenhum cliente.</p></div> :
            clientes.map(c => (
              <div className="item" key={c._id}>
                <div className="item-info">
                  <h3>{c.nome} <span className={'badge ' + (c.ativo ? 'badge-ativo' : 'badge-inativo')}>{c.ativo ? 'Ativo' : 'Inativo'}</span></h3>
                  <div className="item-meta">{c.email}{c.telefone ? ' | ' + c.telefone : ''}</div>
                  {c.endereco && <p>{c.endereco}</p>}
                </div>
                <div className="item-acoes">
                  <button className="btn btn-success" onClick={() => editar(c._id)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => excluir(c._id)}>Excluir</button>
                </div>
            ))
          }
        </div>
    </section>
  );
}

export default ClienteManager;
`;
fs.writeFileSync('ClienteManager.jsx', content, 'utf8');
console.log('OK');
