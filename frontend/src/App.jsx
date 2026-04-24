import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import ProdutoForm from './components/ProdutoForm';
import ProdutoList from './components/ProdutoList';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const listarProdutos = useCallback(async () => {
    setCarregando(true);
    try {
      const data = await api.get('/produtos');
      setProdutos(data.data || []);
    } catch (err) {
      setMensagem('Erro ao carregar produtos.');
      setTimeout(() => setMensagem(''), 3000);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    listarProdutos();
  }, [listarProdutos]);

  const handleSalvar = async (dados) => {
    try {
      if (produtoEditando) {
        await api.put(`/produtos/${produtoEditando._id}`, dados);
        setMensagem('Produto atualizado com sucesso!');
      } else {
        await api.post('/produtos', dados);
        setMensagem('Produto cadastrado com sucesso!');
      }
      setProdutoEditando(null);
      listarProdutos();
      setTimeout(() => setMensagem(''), 3000);
    } catch (err) {
      setMensagem('Erro ao salvar produto.');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  const handleEditar = (produto) => {
    setProdutoEditando(produto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelar = () => {
    setProdutoEditando(null);
  };

  const handleDeletar = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await api.delete(`/produtos/${id}`);
      setMensagem('Produto excluído com sucesso!');
      listarProdutos();
      setTimeout(() => setMensagem(''), 3000);
    } catch (err) {
      setMensagem('Erro ao excluir produto.');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  return (
    <div className="container">
      <h1>🛒 Gerenciador de Produtos</h1>
      {mensagem && (
        <div className={mensagem.includes('Erro') ? 'error' : 'success'}>
          {mensagem}
        </div>
      )}
      <ProdutoForm
        onSalvar={handleSalvar}
        produtoEditando={produtoEditando}
        onCancelar={handleCancelar}
      />
      <div className="card">
        <h2>Lista de Produtos ({produtos.length})</h2>
        <ProdutoList
          produtos={produtos}
          onEditar={handleEditar}
          onDeletar={handleDeletar}
          carregando={carregando}
        />
      </div>
    </div>
  );
}

export default App;

