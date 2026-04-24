// Detecta automaticamente se está em localhost ou produção
function getApiUrl() {
  var isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';
  if (isLocal) {
    return 'http://localhost:5000/api';
  }
  // URL de produção — atualize conforme seu deploy no Render
  return 'https://trabalho-full-stack-gules.vercel.app/api';
}

var API_URL = getApiUrl();

var api = {
  async get(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ erro: 'Erro na requisição' }));
      throw new Error(err.erro || 'Erro na requisição');
    }
    return res.json();
  },
  
  async post(endpoint, data) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ erro: 'Erro na requisição' }));
      throw new Error(err.erro || 'Erro na requisição');
    }
    return res.json();
  },
  
  async put(endpoint, data) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ erro: 'Erro na requisição' }));
      throw new Error(err.erro || 'Erro na requisição');
    }
    return res.json();
  },
  
  async delete(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ erro: 'Erro na requisição' }));
      throw new Error(err.erro || 'Erro na requisição');
    }
    return res.json();
  }
};

