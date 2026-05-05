const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

// Configurações principais (Middleware)
app.use(cors()); // Ativa o CORS para o navegador não bloquear
app.use(express.json()); // Permite que o servidor entenda JSON

// 1. POST - Criar Livro (Create)
app.post('/livros', async (req, res) => {
    try {
        const novoLivro = await prisma.livro.create({
            data: {
                titulo: req.body.titulo,
                autor: req.body.autor,
                isbn: req.body.isbn,
                anoPublicacao: parseInt(req.body.anoPublicacao)
            }
        });
        res.status(201).json({ message: "Livro cadastrado com sucesso", livro: novoLivro });
    } catch (error) {
        console.error("Erro no POST:", error.message);
        res.status(500).json({ error: 'Erro ao cadastrar livro. Verifique se o ISBN já existe.' });
    }
});

// 2. GET - Listar todos os Livros (Read)
app.get('/livros', async (req, res) => {
    try {
        const todosLivros = await prisma.livro.findMany();
        res.json(todosLivros);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar livros' });
    }
});

// 3. PUT - Atualizar Livro (Update)
app.put('/livro/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const livroAtualizado = await prisma.livro.update({
            where: { id },
            data: {
                titulo: req.body.titulo,
                autor: req.body.autor,
                isbn: req.body.isbn,
                anoPublicacao: parseInt(req.body.anoPublicacao)
            }
        });
        res.json({ message: "Livro atualizado!", livro: livroAtualizado });
    } catch (error) {
        console.error("Erro no PUT:", error.message);
        if (error.code === 'P2025') return res.status(404).json({ error: 'Livro não encontrado' });
        res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
});

// 4. DELETE - Remover um Livro específico
app.delete('/livro/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.livro.delete({ where: { id } });
        res.json({ message: "Livro removido com sucesso" });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Livro não encontrado' });
        res.status(500).json({ error: 'Erro ao deletar livro' });
    }
});

// 5. DELETE - Limpar todo o acervo (Bônus)
app.delete('/livros/todos', async (req, res) => {
    try {
        await prisma.livro.deleteMany();
        res.json({ message: "Todos os livros foram removidos com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao limpar acervo' });
    }
});

// Inicialização do Servidor
app.listen(3000, () => {
    console.log('--------------------------------------------');
    console.log('🚀 Servidor da Biblioteca rodando na porta 3000');
    console.log('✅ CORS habilitado para o Front-end');
    console.log('--------------------------------------------');
});
// Rota para cadastrar Usuário
app.post('/usuarios', async (req, res) => {
    try {
        const novoUsuario = await prisma.usuario.create({
            data: {
                email: req.body.email,
                senha: req.body.senha // Em um sistema real, usaríamos criptografia aqui!
            }
        });
        res.status(201).json({ message: "Usuário cadastrado!", usuario: novoUsuario });
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Este email já está cadastrado' });
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});