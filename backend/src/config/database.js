const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

// Placeholder usado no .env.example
const PLACEHOLDER = 'mongodb+srv://usuario:senha@cluster.mongodb.net/nome_do_banco';

const isPlaceholder = (uri) => {
  return uri.includes('usuario:senha') || uri.includes('nome_do_banco');
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && !isPlaceholder(uri)) {
      // URI real configurada — conecta no MongoDB (Atlas, local, etc.)
      await mongoose.connect(uri);
      console.log('✅ MongoDB conectado com sucesso!');
    } else {
      // Sem URI ou ainda é o placeholder — usa MongoDB em memória
      console.log('⚠️  URI do MongoDB não configurada. Iniciando MongoDB em memória para testes...');
      mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      await mongoose.connect(memUri);
      console.log('✅ MongoDB em memória conectado com sucesso!');
    }
  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error.message);
    console.log('Tentando iniciar MongoDB em memória...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      await mongoose.connect(memUri);
      console.log('✅ MongoDB em memória conectado com sucesso!');
    } catch (memError) {
      console.error('❌ Erro ao iniciar MongoDB em memória:', memError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
