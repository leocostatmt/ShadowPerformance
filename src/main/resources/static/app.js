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
    event.preventDefault(); 
    
    const passwordValue = regPasswordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;
    
    let hasError = false;

    // Regra 1: Tamanho mínimo (8), uma letra maiúscula e um número
    const temTamanhoMinimo = passwordValue.length >= 8;
    const temLetraMaiuscula = /[A-Z]/.test(passwordValue);
    const temNumero = /[0-9]/.test(passwordValue); 
    
    if (!temTamanhoMinimo || !temLetraMaiuscula || !temNumero) {
        regPasswordError.textContent = 'A senha deve ter no mínimo 8 caracteres, 1 maiúscula e 1 número.';
        regPasswordError.classList.remove('hidden');
        regPasswordInput.style.borderColor = '#ff4d4d'; 
        hasError = true;
    } else {
        regPasswordError.classList.add('hidden');
        regPasswordInput.style.borderColor = ''; 
    }

    // Regra 2: Confirmação de senha
    if (passwordValue !== confirmPasswordValue) {
        confirmError.textContent = 'As senhas não coincidem. Tente novamente.';
        confirmError.classList.remove('hidden');
        confirmPasswordInput.style.borderColor = '#ff4d4d';
        hasError = true;
    } else {
        confirmError.classList.add('hidden');
        confirmPasswordInput.style.borderColor = '';
    }

    if (hasError) return;
    
    console.log('Validação aprovada! A enviar dados para a API Java...');
    
    const dadosParaJava = {
        nome: document.getElementById('name').value,
        email: regPasswordInput.form.querySelector('#reg-email').value, 
        senha: passwordValue 
    };

    fetch('http://localhost:8080/api/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dadosParaJava) 
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.text();
        } else {
            throw new Error('Erro ao tentar registar. O e-mail poderá já estar em uso.');
        }
    })
    .then(mensagemSucesso => {
        // 1. Mapeia os elementos da tela de sucesso
        const successView = document.getElementById('successView');
        const successMessageText = document.getElementById('successMessageText');
        const countdownElement = document.getElementById('countdown');

        // 2. Oculta o formulário de cadastro e o título principal temporariamente
        registerView.classList.add('hidden');
        formTitle.classList.add('hidden');

        // 3. Define o texto retornado pelo Java e mostra a tela de sucesso
        successMessageText.textContent = mensagemSucesso;
        successView.classList.remove('hidden');

        // 4. Inicia a contagem regressiva de 3 segundos
        let segundosRestantes = 3;
        countdownElement.textContent = segundosRestantes;

        const intervaloContagem = setInterval(() => {
            segundosRestantes--;
            countdownElement.textContent = segundosRestantes;

            if (segundosRestantes <= 0) {
                clearInterval(intervaloContagem); // Para o contador

                // 5. Reseta os formulários e estados antigos
                registerForm.reset();
                document.getElementById('password-rules').style.display = 'none';
                
                // 6. Oculta a tela de sucesso e exibe os elementos padrões estruturais
                successView.classList.add('hidden');
                formTitle.classList.remove('hidden');
                
                // 7. Redireciona o piloto de volta para a tela de login
                switchView(registerView, loginView, 'Shadow Performance');
            }
        }, 1000);
    })
    .catch(erro => {
        console.error('Erro na requisição:', erro);
        alert(erro.message);
    });
});


// ==========================================
// 4. LÓGICA DE LOGIN COM A API
// ==========================================
const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('email');
const loginPasswordInput = document.getElementById('password');
const loginGlobalError = document.getElementById('loginGlobalError'); // Captura a nova mensagem

// Função para limpar os erros visuais quando o piloto volta a digitar
function clearLoginErrors() {
    loginGlobalError.classList.add('hidden');
    loginEmailInput.style.borderColor = '';
    loginPasswordInput.style.borderColor = '';
}

// Ouve as digitações para limpar o erro
loginEmailInput.addEventListener('input', clearLoginErrors);
loginPasswordInput.addEventListener('input', clearLoginErrors);

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const dadosLogin = {
        email: loginEmailInput.value,
        senha: loginPasswordInput.value
    };

    // Altera o texto do botão para indicar carregamento
    const btnSubmit = loginForm.querySelector('.btn-submit');
    const textoOriginalBtn = btnSubmit.textContent;
    btnSubmit.textContent = 'Acessando...';

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
            // Sucesso absoluto, entra no sistema
            localStorage.setItem('olympus_auth', 'true');
            window.location.href = 'home.html';
        } else {
            // FALHA: Mostra o erro dinâmico na tela
            loginGlobalError.textContent = mensagem; // Recebe "Credenciais inválidas." do Java
            loginGlobalError.classList.remove('hidden');
            
            // Pinta as bordas de vermelho
            loginEmailInput.style.borderColor = '#ff4d4d';
            loginPasswordInput.style.borderColor = '#ff4d4d';
            
            // Retorna o botão ao normal
            btnSubmit.textContent = textoOriginalBtn;
        }
    })
    .catch(erro => {
        console.error('Erro de conexão:', erro);
        loginGlobalError.textContent = 'Servidor offline ou erro de conexão.';
        loginGlobalError.classList.remove('hidden');
        btnSubmit.textContent = textoOriginalBtn;
    });
});


// ==========================================
// 5. LÓGICA DE VISUALIZAR SENHA (ÍCONE DE OLHO)
// ==========================================
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

const iconeOlhoAberto = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const iconeOlhoFechado = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;

togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const inputElement = document.getElementById(targetId);

        if (inputElement.type === 'password') {
            inputElement.type = 'text';
            this.innerHTML = iconeOlhoAberto; 
        } else {
            inputElement.type = 'password';
            this.innerHTML = iconeOlhoFechado; 
        }
    });
});


// ==========================================
// 6. VALIDAÇÃO DINÂMICA DA SENHA DE CADASTRO
// ==========================================
const passwordRulesDiv = document.getElementById('password-rules');
const ruleLength = document.getElementById('rule-length');
const ruleUppercase = document.getElementById('rule-uppercase');
const ruleNumber = document.getElementById('rule-number');

// Mostrar a caixa de regras apenas quando o utilizador clicar no campo de senha de cadastro
regPasswordInput.addEventListener('focus', () => {
    passwordRulesDiv.style.display = 'block';
});

// Evento 'input' dispara a cada tecla digitada
regPasswordInput.addEventListener('input', () => {
    const senhaDigitada = regPasswordInput.value;

    // 1. Valida Tamanho (Mínimo 8)
    if (senhaDigitada.length >= 8) {
        ruleLength.classList.add('valid');
        ruleLength.classList.remove('invalid');
    } else {
        ruleLength.classList.remove('valid');
        ruleLength.classList.add('invalid');
    }

    // 2. Valida Letra Maiúscula
    if (/[A-Z]/.test(senhaDigitada)) {
        ruleUppercase.classList.add('valid');
        ruleUppercase.classList.remove('invalid');
    } else {
        ruleUppercase.classList.remove('valid');
        ruleUppercase.classList.add('invalid');
    }

    // 3. Valida Número
    if (/[0-9]/.test(senhaDigitada)) {
        ruleNumber.classList.add('valid');
        ruleNumber.classList.remove('invalid');
    } else {
        ruleNumber.classList.remove('valid');
        ruleNumber.classList.add('invalid');
    }
});

// ==========================================
// 7. LÓGICA DE RECUPERAÇÃO DE SENHA
// ==========================================

// Elementos do DOM
const recoverView = document.getElementById('recoverView');
const showRecoverBtn = document.getElementById('showRecover');
const showLoginFromRecoverBtn = document.getElementById('showLoginFromRecover');
const recoverForm = document.getElementById('recoverForm');
const recoverEmailInput = document.getElementById('recover-email');
const recoverGlobalMessage = document.getElementById('recoverGlobalMessage');

// Navegação: Ir para tela de Recuperação
showRecoverBtn.addEventListener('click', (event) => {
    event.preventDefault();
    switchView(loginView, recoverView, 'Recuperar Acesso');
    // Limpa mensagens anteriores
    recoverGlobalMessage.classList.add('hidden');
    recoverEmailInput.style.borderColor = '';
    recoverEmailInput.value = '';
});

// Navegação: Voltar para o Login
showLoginFromRecoverBtn.addEventListener('click', (event) => {
    event.preventDefault();
    switchView(recoverView, loginView, 'Shadow Performance');
});

// Limpar erros ao digitar no campo de email da recuperação
recoverEmailInput.addEventListener('input', () => {
    recoverGlobalMessage.classList.add('hidden');
    recoverEmailInput.style.borderColor = '';
});

// Comunicação com o Java para envio do E-mail
recoverForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const email = recoverEmailInput.value;
    const btnSubmit = recoverForm.querySelector('.btn-submit');
    const textoOriginalBtn = btnSubmit.textContent;
    
    btnSubmit.textContent = 'Enviando link...';
    btnSubmit.disabled = true;

    // Conectando com a futura rota no Spring Boot
    fetch('http://localhost:8080/api/recuperar-senha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(async resposta => {
        const mensagem = await resposta.text();
        btnSubmit.textContent = textoOriginalBtn;
        btnSubmit.disabled = false;
        
        if (resposta.ok) {
            // Sucesso: E-mail enviado
            recoverGlobalMessage.textContent = "✅ Link de recuperação enviado! Verifique a sua caixa de entrada e a pasta de spam.";
            recoverGlobalMessage.style.color = '#4CAF50'; // Verde sucesso
            recoverGlobalMessage.classList.remove('hidden');
            recoverEmailInput.value = ''; // Esvazia o campo
        } else {
            // Erro: E-mail não encontrado ou erro no servidor
            recoverGlobalMessage.textContent = mensagem; // Recebe o erro do Java
            recoverGlobalMessage.style.color = '#ff4d4d'; // Vermelho erro
            recoverGlobalMessage.classList.remove('hidden');
            recoverEmailInput.style.borderColor = '#ff4d4d';
        }
    })
    .catch(erro => {
        console.error('Erro de conexão:', erro);
        btnSubmit.textContent = textoOriginalBtn;
        btnSubmit.disabled = false;
        
        recoverGlobalMessage.textContent = 'Servidor offline ou erro de conexão.';
        recoverGlobalMessage.style.color = '#ff4d4d';
        recoverGlobalMessage.classList.remove('hidden');
    });
});