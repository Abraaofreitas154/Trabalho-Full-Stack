const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  try {
    // Tenta conectar na URI configurada
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('cluster.mongodb.net')) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB conectado com sucesso!');
    } else if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('cluster.mongodb.net')) {
      // URI ainda é o placeholder, cria banco em memória
      console.log('⚠️  URI do MongoDB não configurada. Iniciando MongoDB em memória para testes...');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('MongoDB em memória conectado com sucesso!');
    } else {
      // Sem URI definida, cria banco em memória
      console.log('⚠️  URI do MongoDB não encontrada. Iniciando MongoDB em memória para testes...');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('MongoDB em memória conectado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error.message);
    console.log('Tentando iniciar MongoDB em memória...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('MongoDB em memória conectado com sucesso!');
    } catch (memError) {
      console.error('Erro ao iniciar MongoDB em memória:', memError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
