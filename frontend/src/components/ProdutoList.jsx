export default function ProdutoList({ produtos, onEditar, onDeletar, carregando }) {
  if (carregando) {
    return <div className="loading">Carregando produtos...</div>;
  }

  if (!produtos || produtos.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum produto cadastrado ainda.</p>
        <p>Adicione seu primeiro produto usando o formulário acima!</p>
      </div>
    );
  }

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <div className="produto-lista">
      {produtos.map((produto) => (
        <div key={produto._id} className="produto-item">
          <div className="produto-info">
            <h3>{produto.nome}</h3>
            <p>{produto.descricao}</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Categoria: {produto.categoria} | Quantidade: {produto.quantidade} | {produto.ativo ? 'Ativo' : 'Inativo'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="produto-preco">{formatarPreco(produto.preco)}</div>
            <div className="produto-acoes">
              <button className="btn btn-success" onClick={() => onEditar(produto)}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => onDeletar(produto._id)}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

