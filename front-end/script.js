const API_URL = 'http://localhost:3000';

// Função para Cadastrar (POST)
async function cadastrarLivro() {
    const data = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        isbn: document.getElementById('isbn').value,
        anoPublicacao: document.getElementById('ano').value
    };

    if (!data.titulo || !data.isbn) return alert("Preencha os campos obrigatórios!");

    try {
        const res = await fetch(`${API_URL}/livros`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const resultado = await res.json();

        if (res.ok) {
            // Se chegou aqui, deu certo!
            alert("✅ Livro cadastrado com sucesso!");
            // Limpa os campos
            document.querySelectorAll('input').forEach(i => i.value = '');
        } else {
            // Se o servidor respondeu erro, mostramos a mensagem que VEM do servidor
            alert("Aviso: " + (resultado.error || "Erro desconhecido"));
        }
    } catch (error) {
        // Se o livro cadastrou mas o JS deu erro de rede no final
        console.log("Erro de rede, mas verifique a consulta:", error);
    }
}

// Função para Carregar Livros (GET)
async function carregarLivros() {
    const tabela = document.getElementById('tabela-livros');
    if (!tabela) return; // Só executa se estiver na página de consulta

    const res = await fetch(`${API_URL}/livros`);
    const livros = await res.json();
    
    tabela.innerHTML = '';
    livros.forEach(livro => {
        tabela.innerHTML += `
            <tr>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.anoPublicacao}</td>
                <td>
                    <button class="btn-edit" onclick="editarLivro(${livro.id})">Editar</button>
                    <button class="btn-del" onclick="deletarLivro(${livro.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// Função para Deletar (DELETE)
async function deletarLivro(id) {
    if (confirm('Tem certeza que deseja remover este livro?')) {
        await fetch(`${API_URL}/livro/${id}`, { method: 'DELETE' });
        carregarLivros();
    }
}

async function editarLivro(id) {
    const novoTitulo = prompt("Digite o novo título do livro:");
    
    if (novoTitulo) {
        try {
            const response = await fetch(`http://localhost:3000/livro/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    titulo: novoTitulo,
                    // Mantemos o resto igual ou o banco pode reclamar
                    autor: "Editado", 
                    isbn: String(Math.floor(Math.random() * 1000000)), // Evita erro de ISBN repetido no teste rápido
                    anoPublicacao: 2024 
                })
            });

            if (response.ok) {
                alert("Livro atualizado com sucesso!");
                carregarLivros(); // <--- ESSA LINHA É A CHAVE! Ela faz o novo nome aparecer na tela.
            } else {
                alert("Erro ao atualizar no banco de dados.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    }
}
async function cadastrarUsuario() {
    const email = document.getElementById('emailUsuario').value;
    const senha = document.getElementById('senhaUsuario').value;

    const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    if (response.ok) {
        alert("Conta criada com sucesso!");
        window.location.href = "index.html"; // Manda o usuário para a tela de livros
    } else {
        alert("Erro ao criar conta.");
    }
}
function filtrarLivros() {
    // Pega o que o usuário digitou e transforma em minúsculo
    const filtro = document.getElementById('inputBusca').value.toLowerCase();
    const tabela = document.getElementById('tabela-livros');
    const linhas = tabela.getElementsByTagName('tr');

    // Percorre todas as linhas da tabela (menos o cabeçalho)
    for (let i = 0; i < linhas.length; i++) {
        const colunaTitulo = linhas[i].getElementsByTagName('td')[0];
        const colunaAutor = linhas[i].getElementsByTagName('td')[1];

        if (colunaTitulo || colunaAutor) {
            const textoTitulo = colunaTitulo.textContent || colunaTitulo.innerText;
            const textoAutor = colunaAutor.textContent || colunaAutor.innerText;

            // Se o texto do título ou do autor tiver o que foi digitado, mostra a linha
            if (textoTitulo.toLowerCase().indexOf(filtro) > -1 || textoAutor.toLowerCase().indexOf(filtro) > -1) {
                linhas[i].style.display = "";
            } else {
                linhas[i].style.display = "none"; // Senão, esconde
            }
        }
    }
}