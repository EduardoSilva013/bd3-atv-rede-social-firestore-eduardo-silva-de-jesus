/***** CONEXÃO COM O MONGODB (via mongoose) *****/
require('dotenv').config();

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
// Banco (dentro do cluster) onde os posts ficam. É criado automaticamente no primeiro post:
const MONGODB_DB = process.env.MONGODB_DB || 'BD3-NoSQL-RedeSocial';

// Estrutura (schema) de um post:
const postSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true, maxlength: 100 },
    texto: { type: String, required: true, trim: true, maxlength: 1000 },
    data: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Cria a conexão com o banco de dados:
async function conectar() {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log(`Conectado ao MongoDB (banco: ${MONGODB_DB})`);
}

// Converte o documento do Mongo em objeto simples (data em milissegundos):
function paraObjeto(doc) {
    return {
        id: doc._id.toString(),
        titulo: doc.titulo,
        texto: doc.texto,
        data: doc.data.getTime()
    };
}

// Busca todos os posts já realizados (do mais antigo para o mais novo):
async function buscarPosts() {
    const posts = await Post.find().sort({ data: 1 });
    return posts.map(paraObjeto);
}

// Salva um novo post e devolve o post já com id e data:
async function salvarPost({ titulo, texto }) {
    const post = await Post.create({ titulo, texto });
    return paraObjeto(post);
}

module.exports = { conectar, buscarPosts, salvarPost };
