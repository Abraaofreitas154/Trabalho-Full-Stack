# 🚀 Desafio Fullstack - PWA + Node.js + MongoDB

Aplicação fullstack completa com frontend PWA (React + Vite) e backend Node.js (Express + Mongoose), implementando CRUD de produtos, clientes e pedidos com persistência no MongoDB.

---

## 📁 Estrutura do Projeto

```
├── backend/                # API Node.js + Express + Mongoose
│   ├── src/
│   │   ├── config/         # Configuração do banco de dados
│   │   ├── controllers/    # Lógica dos endpoints
│   │   ├── models/         # Entidades do MongoDB (ORM)
│   │   └── routes/         # Rotas da API
│   ├── server.js           # Entry point do servidor
│   ├── package.json
│   ├── .env                # Variáveis de ambiente (não commitar!)
│   └── .env.example        # Exemplo de variáveis
│
└── frontend/               # Aplicação PWA (React + Vite)
    ├── public/
    │   ├── manifest.json   # Configuração PWA
    │   ├── sw.js           # Service Worker
    │   └── icon-*.svg      # Ícones do app
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── api.js          # Cliente HTTP
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── .env.example
```

---

## ⚙️ Tecnologias Utilizadas

### Backend
- **Node.js** + **Express**
- **MongoDB** com **Mongoose** (ORM)
- **MongoDB Memory Server** - banco em memória para testes rápidos
- **CORS** para comunicação cross-origin
- **dotenv** para variáveis de ambiente

### Frontend
- **React 18**
- **Vite** (build tool)
- **PWA** com Service Worker e Manifest
- **CSS** puro (sem framework de UI)

---

## 🛠️ Configuração Local

### Pré-requisitos
- Node.js (v18+)

### 1. Clone e acesse o projeto
```bash
cd Trabalho-Full-Stack-main
```

### 2. Configure o Backend
```bash
cd backend
npm install
```

Crie o arquivo `.env` baseado no exemplo:
```bash
cp .env.example .env
```

#### Opções de banco de dados:

**Opção A - MongoDB em Memória (padrão - não precisa instalar nada!)**
O backend detecta automaticamente se a URI está como placeholder e inicia um MongoDB em memória. Perfeito para testes rápidos!

**Opção B - MongoDB Local**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/produtos_db
```

**Opção C - MongoDB Atlas (para deploy)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/produtos_db?retryWrites=true&w=majority
```

Inicie o servidor:
```bash
npm run dev     # modo watch (Node 18+)
# ou
npm start       # produção
```

O backend estará em: `http://localhost:5000`

### 3. Configure o Frontend
```bash
cd ../frontend
npm install
```

Crie o arquivo `.env` baseado no exemplo:
```bash
cp .env.example .env
```

Inicie o app:
```bash
npm run dev
```

O frontend estará em: `http://localhost:3000`

---

## 🌐 Deploy

### 1. Banco de Dados - MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) e crie um cluster gratuito
2. Crie um usuário e adicione seu IP à whitelist
3. Copie a **Connection String** e substitua no `.env` do backend

### 2. Backend - Render Blueprint (YAML) - RECOMENDADO ✅

O projeto já possui o arquivo `render.yaml` configurado para deploy automático via **Render Blueprint**.

1. Acesse [Render Blueprints](https://dashboard.render.com/blueprint/new)
2. Conecte seu repositório do GitHub
3. Clique em **Apply Blueprint**
4. Configure a variável `MONGODB_URI` com a URI do MongoDB Atlas
5. O Render criará automaticamente o Web Service

**O `render.yaml` configurado:**
```yaml
services:
  - type: web
    name: trabalho-fullstack-api
    runtime: node
    rootDir: backend
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
    healthCheckPath: /
    autoDeploy: true
```

> 💡 Ao fazer push para o `main`, o Render faz deploy automático (`autoDeploy: true`)

### 3. Frontend - Vercel (Recomendado)

1. Acesse [Vercel](https://vercel.com) e crie uma conta
2. Importe seu repositório do GitHub
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Adicione a variável de ambiente:
   ```
   VITE_API_URL=https://sua-api.onrender.com/api
   ```
5. Faça o deploy!

### Alternativas de Deploy

| Serviço | Tipo | Link |
|---------|------|------|
| Render | Backend | https://render.com |
| Railway | Backend | https://railway.app |
| Heroku | Backend | https://heroku.com |
| Vercel | Frontend | https://vercel.com |
| Netlify | Frontend | https://netlify.com |
| Surge.sh | Frontend | https://surge.sh |

---

## 📱 Funcionalidades PWA

- ✅ **Instalável**: Adicione à tela inicial do celular/desktop
- ✅ **Service Worker**: Cache de assets para funcionamento offline
- ✅ **Manifest.json**: Ícone, tema e configuração nativa
- ✅ **Responsivo**: Funciona em qualquer tamanho de tela

---

## 📝 Entidades

### Produto
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| nome | String | ✅ |
| descricao | String | ❌ |
| preco | Number | ✅ |
| quantidade | Number | ✅ |
| categoria | String | ❌ |
| ativo | Boolean | ❌ |
| createdAt | Date | Automático |
| updatedAt | Date | Automático |

### Cliente
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| nome | String | ✅ |
| email | String | ✅ |
| telefone | String | ❌ |
| endereco | String | ❌ |
| ativo | Boolean | ❌ |
| createdAt | Date | Automático |
| updatedAt | Date | Automático |

### Pedido (Nova Entidade)
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| cliente | ObjectId (ref Cliente) | ✅ |
| itens | Array de { produto, quantidade, precoUnitario } | ✅ |
| total | Number | ✅ (calculado automaticamente) |
| status | String (pendente/processando/entregue/cancelado) | ❌ |
| observacao | String | ❌ |
| createdAt | Date | Automático |
| updatedAt | Date | Automático |

### Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/produtos` | Listar todos |
| GET | `/api/produtos/:id` | Buscar por ID |
| POST | `/api/produtos` | Criar produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Remover produto |
| GET | `/api/clientes` | Listar todos |
| GET | `/api/clientes/:id` | Buscar por ID |
| POST | `/api/clientes` | Criar cliente |
| PUT | `/api/clientes/:id` | Atualizar cliente |
| DELETE | `/api/clientes/:id` | Remover cliente |
| GET | `/api/pedidos` | Listar todos |
| GET | `/api/pedidos/:id` | Buscar por ID |
| POST | `/api/pedidos` | Criar pedido |
| PUT | `/api/pedidos/:id` | Atualizar pedido |
| DELETE | `/api/pedidos/:id` | Remover pedido |

---

## ✅ Checklist do Desafio

- [x] Frontend em PWA (React + Vite + Service Worker + Manifest)
- [x] Backend em Node.js (Express)
- [x] MongoDB com ORM (Mongoose)
- [x] Nova entidade criada (Pedido)
- [x] Operações CRUD completas (Produtos, Clientes, Pedidos)
- [x] MongoDB em memória para testes rápidos
- [x] Deploy pronto (instruções para produção)

---

## 📄 Licença

Projeto criado para fins educacionais.

