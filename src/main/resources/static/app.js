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
    switchView(loginView, registerView, 'Novo Cadastro');
});

// Voltar para Login
showLoginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    switchView(registerView, loginView, 'Olympus Pass');
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
    
    // Se passar por todas as validações:
    console.log('Validação aprovada! Dados prontos para envio ao back-end.');
    
    // Aqui você pode adicionar um alert() temporário para confirmar que funcionou, ou fazer o fetch() para a API.
    // alert("Cadastro validado com sucesso!");
});

// ==========================================
// 4. LIMPEZA DE ERROS EM TEMPO REAL
// ==========================================
// Remove os alertas visuais assim que o usuário volta a digitar

regPasswordInput.addEventListener('input', () => {
    regPasswordError.classList.add('hidden');
    regPasswordInput.style.borderColor = '';
});

confirmPasswordInput.addEventListener('input', () => {
    confirmError.classList.add('hidden');
    confirmPasswordInput.style.borderColor = '';
});