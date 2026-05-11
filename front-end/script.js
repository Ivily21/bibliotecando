const API_URL = 'http://localhost:3000';

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
            alert("✅ Livro cadastrado com sucesso!");
            document.querySelectorAll('input').forEach(i => i.value = '');
        } else {
            alert("Aviso: " + (resultado.error || "Erro desconhecido"));
        }
    } catch (error) {
        console.log("Erro de rede, mas verifique a consulta:", error);
    }
}

async function carregarLivros() {
    const tabela = document.getElementById('tabela-livros');
    if (!tabela) return; 

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
                    autor: "Editado", 
                    isbn: String(Math.floor(Math.random() * 1000000)), 
                    anoPublicacao: 2024 
                })
            });

            if (response.ok) {
                alert("Livro atualizado com sucesso!");
                carregarLivros(); 
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
        window.location.href = "index.html"; 
    } else {
        alert("Erro ao criar conta.");
    }
}
function filtrarLivros() {
    
    const filtro = document.getElementById('inputBusca').value.toLowerCase();
    const tabela = document.getElementById('tabela-livros');
    const linhas = tabela.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        const colunaTitulo = linhas[i].getElementsByTagName('td')[0];
        const colunaAutor = linhas[i].getElementsByTagName('td')[1];

        if (colunaTitulo || colunaAutor) {
            const textoTitulo = colunaTitulo.textContent || colunaTitulo.innerText;
            const textoAutor = colunaAutor.textContent || colunaAutor.innerText;

            if (textoTitulo.toLowerCase().indexOf(filtro) > -1 || textoAutor.toLowerCase().indexOf(filtro) > -1) {
                linhas[i].style.display = "";
            } else {
                linhas[i].style.display = "none"; 
            }
        }
    }
}