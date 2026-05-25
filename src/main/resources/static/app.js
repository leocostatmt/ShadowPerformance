// ==========================================
// 1. MAPEAMENTO DE ELEMENTOS DO DOM
// ==========================================

// Elementos de Troca de Telas
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const formTitle = document.getElementById('formTitle');

// Elementos do Formulário de Cadastro
const registerForm = document.getElementById('registerForm');
const regPasswordInput = document.getElementById('reg-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const regPasswordError = document.getElementById('regPasswordError');
const confirmError = document.getElementById('confirmError');

// ==========================================
// 2. LÓGICA DE ALTERNÂNCIA DE TELAS
// ==========================================

function switchView(viewToHide, viewToShow, newTitle) {
    viewToHide.classList.add('hidden');
    viewToShow.classList.remove('hidden');
    formTitle.textContent = newTitle;
}

// Ir para Cadastro
showRegisterBtn.addEventListener('click', (event) => {
    event.preventDefault();
    switchView(loginView, registerView, 'Novo piloto');
});

// Voltar para Login
showLoginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    switchView(registerView, loginView, 'Shadow Performance');
});

// ==========================================
// 3. VALIDAÇÃO DO FORMULÁRIO DE CADASTRO
// ==========================================

registerForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio para validar primeiro
    
    const passwordValue = regPasswordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;
    
    let hasError = false;

    // Regra 1: Tamanho mínimo (8) e pelo menos uma letra maiúscula
    const temTamanhoMinimo = passwordValue.length >= 8;
    const temLetraMaiuscula = /[A-Z]/.test(passwordValue);
    
    if (!temTamanhoMinimo || !temLetraMaiuscula) {
        regPasswordError.textContent = 'A senha deve ter no mínimo 8 caracteres e 1 letra maiúscula.';
        regPasswordError.classList.remove('hidden');
        regPasswordInput.style.borderColor = '#ff4d4d'; // Borda vermelha
        hasError = true;
    } else {
        regPasswordError.classList.add('hidden');
        regPasswordInput.style.borderColor = ''; // Remove o estilo inline para voltar ao CSS padrão
    }

    // Regra 2: Confirmação de senha (devem ser idênticas)
    if (passwordValue !== confirmPasswordValue) {
        confirmError.textContent = 'As senhas não coincidem. Tente novamente.';
        confirmError.classList.remove('hidden');
        confirmPasswordInput.style.borderColor = '#ff4d4d';
        hasError = true;
    } else {
        confirmError.classList.add('hidden');
        confirmPasswordInput.style.borderColor = '';
    }

    // Se houver erros, interrompe a função aqui
    if (hasError) return;
    
    // Se passar por todas as validações (substitua o código a partir daqui):
    console.log('Validação aprovada! A enviar dados para a API Java...');
    
    // 1. Criamos um objeto com os nomes EXATAMENTE iguais ao da sua classe CadastroRequest no Java
    const dadosParaJava = {
        nome: document.getElementById('name').value,
        email: regPasswordInput.form.querySelector('#reg-email').value, // ou document.getElementById('reg-email').value
        senha: passwordValue // Variável que já validámos antes
    };

    // 2. Usamos o Fetch para enviar os dados para o Spring Boot (assumindo que o Java corre na porta 8080)
    fetch('http://localhost:8080/api/cadastro', {
        method: 'POST', // Método de envio
        headers: {
            'Content-Type': 'application/json' // Dizemos ao Java que estamos a enviar um JSON
        },
        body: JSON.stringify(dadosParaJava) // Transformamos o objeto Javascript em texto JSON
    })
    .then(resposta => {
        // Verifica se o Java devolveu sucesso (status 200 OK)
        if (resposta.ok) {
            return resposta.text();
        } else {
            throw new Error('Erro ao tentar registar. O e-mail poderá já estar em uso.');
        }
    })
    .then(mensagemSucesso => {
        // Se correu bem, mostramos a mensagem do Java e reencaminhamos para o Login
        alert(mensagemSucesso);
        registerForm.reset(); // Limpa os campos do formulário
        switchView(registerView, loginView, 'Shadow Performance'); // Volta para a tela de login
    })
    .catch(erro => {
        // Se deu erro (ex: servidor desligado ou email duplicado)
        console.error('Erro na requisição:', erro);
        alert(erro.message);
    });
});



// 4. Blur background ao focar nos campos de senha


// Capturando o formulário de Login
const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('email');
const loginPasswordInput = document.getElementById('password');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    const dadosLogin = {
        email: loginEmailInput.value,
        senha: loginPasswordInput.value
    };

    console.log('A tentar fazer login...');

    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLogin)
    })
    .then(async resposta => {
        const mensagem = await resposta.text();
        
        if (resposta.ok) {
            // Sucesso! O Java retornou status 200
            alert(mensagem); // Mostra o "Bem-vindo de volta..."
            
            // Guarda no navegador que o utilizador está autenticado
            localStorage.setItem('olympus_auth', 'true');
            
            // Redireciona para a nova tela Home
            window.location.href = 'home.html';
        } else {
            // Falha (senha errada ou e-mail não existe)
            alert(mensagem); // Mostra o "Credenciais inválidas"
        }
    })
    .catch(erro => {
        console.error('Erro de conexão:', erro);
        alert('Erro ao tentar conectar com o servidor.');
    });
});



// ==========================================
// 5. LÓGICA DE VISUALIZAR SENHA (ÍCONE DE OLHO)
// ==========================================

// Seleciona todos os botões de visualizar senha
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

// Código dos SVGs para alternar
const iconeOlhoAberto = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const iconeOlhoFechado = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;

togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Pega o ID do input correspondente através do atributo data-target do HTML
        const targetId = this.getAttribute('data-target');
        const inputElement = document.getElementById(targetId);

        // Alterna entre password e text
        if (inputElement.type === 'password') {
            inputElement.type = 'text';
            this.innerHTML = iconeOlhoAberto; // Muda para o ícone sem o risco
        } else {
            inputElement.type = 'password';
            this.innerHTML = iconeOlhoFechado; // Volta para o ícone com o risco
        }
    });
});