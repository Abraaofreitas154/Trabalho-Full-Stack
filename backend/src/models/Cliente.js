const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome do cliente é obrigatório'],
      trim: true,
      maxlength: [100, 'O nome não pode ter mais de 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Por favor, informe um e-mail válido',
      ],
    },
    telefone: {
      type: String,
      trim: true,
      maxlength: [20, 'O telefone não pode ter mais de 20 caracteres'],
    },
    endereco: {
      type: String,
      trim: true,
      maxlength: [300, 'O endereço não pode ter mais de 300 caracteres'],
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice único para email
clienteSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Cliente', clienteSchema);

