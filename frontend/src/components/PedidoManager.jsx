import { useState, useEffect } from 'react';
import api from '../api/api';

function PedidoManager() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({ cliente: '', status: 'pendente', observacao: '', itens: [] });
  const [itemAtual, setItemAtual] = useState({ produto: '', quantidade: '1', precoUnitario: '' });

  useEffect(() => { carregarPedidos(); carregarClientes(); carregarProdutos(); }, []);

  const showMsg = (texto, tipo = 'success') => { setMsg({ texto, tipo }); setTimeout(() => setMsg(''), 3000); };

  async function carregarPedidos() {
    setLoading(true);
    try { const res = await api.get('/pedidos'); setPedidos(res.data || []); }
    catch (err) { showMsg('Erro: ' + err.message, 'error'); }
    finally { setLoading(false); }
  }

  async function carregarClientes() {
    try { const res = await api.get('/clientes'); setClientes(res.data || []); }
    catch (err) { console.log(err); }
  }

  async function carregarProdutos() {
    try { const res = await api.get('/produtos'); setProdutos(res.data || []); }
    catch (err) { console.log(err); }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  }

  function onChangeItem(e) {
    const { name, value } = e.target;
    setItemAtual(p => ({ ...p, [name]: value }));
  }

  function adicionarItem() {
    if (!itemAtual.produto || !itemAtual.quantidade || parseInt(itemAtual.quantidade) < 1) {
      setErro('Selecione um produto e quantidade válida'); return;
    }
    const prod = produtos.find(p => p._id === itemAtual.produto);
    const preco = parseFloat(itemAtual.precoUnitario) || prod.preco;
    setForm(p => ({
      ...p,
      itens: [...p.itens, { produto: itemAtual.produto, quantidade: parseInt(itemAtual.quantidade), precoUnitario: preco }]
    }));
    setItemAtual({ produto: '', quantidade: '1', precoUnitario: '' });
    setErro('');
  }

  function removerItem(idx) {
    setForm(p => ({ ...p, itens: p.itens.filter((_, i) => i !== idx) }));
  }

  async function onSubmit(e) {
    e.preventDefault(); setErro('');
    if (!form.cliente) { setErro('Selecione um cliente'); return; }
    if (form.itens.length === 0) { setErro('Adicione pelo menos um item'); return; }
    const dados = { cliente: form.cliente, itens: form.itens, status: form.status, observacao: form.observacao.trim() };
    try {
      if (editando) { await api.put('/pedidos/' + editando, dados); showMsg('Atualizado!'); }
      else { await api.post('/pedidos', dados); showMsg('Cadastrado!'); }
      reset(); carregarPedidos();
    } catch (err) { setErro(err.message); }
  }

  function reset() { setForm({ cliente: '', status: 'pendente', observacao: '', itens: [] }); setEditando(null); setErro(''); setItemAtual({ produto: '', quantidade: '1', precoUnitario: '' }); }

  async function editar(id) {
    try { const r = await api.get('/pedidos/' + id); const p = r.data;
      setForm({ cliente: p.cliente._id, status: p.status, observacao: p.observacao || '', itens: p.itens.map(i => ({ produto: i.produto._id, quantidade: i.quantidade, precoUnitario: i.precoUnitario })) });
      setEditando(id);
    } catch (err) { showMsg('Erro: ' + err.message, 'error'); }
  }

  async function excluir(id) {
    if (!confirm('Excluir?')) return;
    try { await api.delete('/pedidos/' + id); showMsg('Excluído!'); carregarPedidos(); }
    catch (err) { showMsg('Erro: ' + err.message, 'error'); }
  }

  const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const getNomeProduto = id => { const p = produtos.find(x => x._id === id); return p ? p.nome : id; };
  const getNomeCliente = id => { const c = clientes.find(x => x._id === id); return c ? c.nome : id; };
  const statusClass = s => s === 'entregue' ? 'badge-ativo' : s === 'cancelado' ? 'badge-inativo' : 'badge-warning';

  return (
    <section className="tab-content active">
      {msg && <div className={'mensagem ' + msg.tipo}>{msg.texto}</div>}
      <div className="card">
        <h2>{editando ? 'Editar Pedido' : 'Novo Pedido'}</h2>
        {erro && <div className="error">{erro}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Cliente *</label>
            <select name="cliente" value={form.cliente} onChange={onChange} required>
              <option value="">Selecione...</option>
              {clientes.map(c => <option key={c._id} value={c._id}>{c.nome} ({c.email})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={onChange}>
              <option value="pendente">Pendente</option>
              <option value="processando">Processando</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="form-group"><label>Observação</label><textarea name="observacao" value={form.observacao} onChange={onChange} rows="2" /></div>
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3>Itens do Pedido</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Produto</label>
                <select name="produto" value={itemAtual.produto} onChange={onChangeItem}>
                  <option value="">Selecione...</option>
                  {produtos.map(p => <option key={p._id} value={p._id}>{p.nome} - {fmt(p.preco)}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Qtd</label><input type="number" name="quantidade" value={itemAtual.quantidade} onChange={onChangeItem} min="1" /></div>
              <div className="form-group"><label>Preço Unit.</label><input type="number" name="precoUnitario" value={itemAtual.precoUnitario} onChange={onChangeItem} step="0.01" placeholder={itemAtual.produto ? fmt(produtos.find(p=>p._id===itemAtual.produto)?.preco||0) : 'auto'} /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button type="button" className="btn btn-primary" onClick={adicionarItem}>+ Adicionar</button></div>
            {form.itens.length > 0 && (
              <div className="lista" style={{ marginTop: '0.5rem' }}>
                {form.itens.map((item, idx) => (
                  <div className="item" key={idx} style={{ padding: '0.5rem' }}>
                    <div className="item-info"><h4>{getNomeProduto(item.produto)}</h4><div className="item-meta">Qtd: {item.quantidade} x {fmt(item.precoUnitario)}</div>
                    <div className="item-acoes"><button type="button" className="btn btn-danger" onClick={() => removerItem(idx)}>Remover</button></div>
                ))}
                <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '0.5rem' }}>Total: {fmt(form.itens.reduce((a,i)=>a+i.quantidade*i.precoUnitario,0))}</div>
            )}
          </div>
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">{editando ? 'Atualizar' : 'Cadastrar'}</button>
            {editando && <button type="button" className="btn btn-secondary" onClick={reset}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <h2>Pedidos ({pedidos.length})</h2>
        {loading && <div className="loading">Carregando...</div>}
        <div className="lista">
          {pedidos.length === 0 ? <div className="empty-state"><p>Nenhum pedido.</p></div> :
            pedidos.map(p => (
              <div className="item" key={p._id}>
                <div className="item-info">
                  <h3>#{p._id.slice(-6)} - {p.cliente?.nome || getNomeCliente(p.cliente)} <span className={'badge ' + statusClass(p.status)}>{p.status}</span></h3>
                  <div className="item-meta">{p.itens?.length || 0} item(s) | Total: {fmt(p.total)}</div>
                  {p.observacao && <p>{p.observacao}</p>}
                </div>
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

export default PedidoManager;
