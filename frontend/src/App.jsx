import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, User, Menu, Zap, Flame, 
  ArrowRight, X, Filter, Trash2, Plus, Minus, Check, 
  Eye, EyeOff, CheckCircle2, AlertCircle, LogOut, MailCheck
} from 'lucide-react';

// ==========================================
// 1. ECRÃ DE AUTENTICAÇÃO (Login, Registo, Recuperação, Redefinição)
// ==========================================
const AuthScreen = ({ onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState('login'); 
  const [formTitle, setFormTitle] = useState('Shadow Performance');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [resetToken, setResetToken] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalMessage, setGlobalMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(3);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParams = params.get('token');
    
    if (tokenParams) {
      setResetToken(tokenParams);
      setCurrentView('reset');
      setFormTitle('Nova Senha');
    }
  }, []);

  useEffect(() => {
    setGlobalMessage({ type: '', text: '' });
  }, [email, password, name, confirmPassword]);

  useEffect(() => {
    let timer;
    if (currentView === 'success' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (currentView === 'success' && countdown === 0) {
      switchView('login', 'Shadow Performance');
      setEmail(''); setPassword(''); setName(''); setConfirmPassword(''); setCountdown(3);
    }
    return () => clearTimeout(timer);
  }, [currentView, countdown]);

  const switchView = (view, title) => {
    setCurrentView(view);
    setFormTitle(title);
    setGlobalMessage({ type: '', text: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      });
      const textResponse = await response.text();
      if (response.ok) {
        onLoginSuccess();
      } else {
        setGlobalMessage({ type: 'error', text: textResponse || 'Credenciais inválidas.' });
      }
    } catch (error) {
      setGlobalMessage({ type: 'error', text: 'Servidor Java offline ou erro de CORS.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setGlobalMessage({ type: 'error', text: 'A senha não cumpre os requisitos mínimos.' });
      return;
    }
    if (password !== confirmPassword) {
      setGlobalMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name, email, senha: password })
      });
      const textResponse = await response.text();
      if (response.ok) {
        setGlobalMessage({ type: 'success', text: textResponse || 'Conta criada com sucesso!' });
        switchView('success', 'Piloto Registado!');
      } else {
        setGlobalMessage({ type: 'error', text: textResponse || 'Erro: O e-mail poderá já estar em uso.' });
      }
    } catch (error) {
      setGlobalMessage({ type: 'error', text: 'Servidor Java offline ou erro de ligação.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const textResponse = await response.text();
      if (response.ok) {
        switchView('recover-success', 'Verifique o seu E-mail');
      } else {
        setGlobalMessage({ type: 'error', text: textResponse });
      }
    } catch (error) {
      setGlobalMessage({ type: 'error', text: 'Servidor Java offline ou falha ao contactar o servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setGlobalMessage({ type: 'error', text: 'A senha não cumpre os requisitos mínimos.' });
      return;
    }
    if (password !== confirmPassword) {
      setGlobalMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, novaSenha: password })
      });
      const textResponse = await response.text();
      
      if (response.ok) {
        setGlobalMessage({ type: 'success', text: textResponse });
        window.history.replaceState({}, document.title, "/"); 
        
        setTimeout(() => {
          switchView('login', 'Shadow Performance');
          setPassword('');
          setConfirmPassword('');
        }, 3000);
      } else {
        setGlobalMessage({ type: 'error', text: textResponse });
      }
    } catch (error) {
      setGlobalMessage({ type: 'error', text: 'Servidor Java offline ou falha de ligação.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans selection:bg-red-600 selection:text-white relative">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-[128px]"></div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-8 w-full max-w-md rounded-xl z-10 shadow-2xl">
        {currentView !== 'success' && currentView !== 'recover-success' && (
          <h2 className="text-3xl font-black text-white text-center uppercase tracking-wider mb-8">
            {formTitle === 'Shadow Performance' ? (
              <>SHADOW<span className="text-red-600">PERFORMANCE</span></>
            ) : formTitle}
          </h2>
        )}

        {globalMessage.text && currentView !== 'success' && (
          <div className={`p-4 rounded mb-6 flex items-start gap-3 ${globalMessage.type === 'error' ? 'bg-red-500/10 border border-red-500/50 text-red-500' : 'bg-green-500/10 border border-green-500/50 text-green-500'}`}>
            {globalMessage.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
            <span className="text-sm font-medium">{globalMessage.text}</span>
          </div>
        )}

        {/* --- VISTA: REDEFINIR SENHA --- */}
        {currentView === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
            <p className="text-zinc-400 text-sm text-center mb-6">O seu token foi validado. Crie agora a sua nova senha.</p>
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Nova Senha</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pr-12 focus:outline-none focus:border-red-600 transition-colors rounded" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-zinc-500"><Eye className="w-5 h-5" /></button>
              </div>
              {password.length > 0 && (
                <div className="mt-3 p-3 bg-zinc-900 border border-zinc-800 rounded space-y-1">
                  <p className={`text-xs flex items-center gap-2 ${hasMinLength ? 'text-green-500' : 'text-zinc-500'}`}><CheckCircle2 className="w-3 h-3" /> Mínimo de 8 caracteres</p>
                  <p className={`text-xs flex items-center gap-2 ${hasUppercase ? 'text-green-500' : 'text-zinc-500'}`}><CheckCircle2 className="w-3 h-3" /> Pelo menos 1 letra maiúscula</p>
                  <p className={`text-xs flex items-center gap-2 ${hasNumber ? 'text-green-500' : 'text-zinc-500'}`}><CheckCircle2 className="w-3 h-3" /> Pelo menos 1 número</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Confirmar Nova Senha</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pr-12 focus:outline-none focus:border-red-600 transition-colors rounded" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-zinc-500"><Eye className="w-5 h-5" /></button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-4 hover:bg-red-700 transition-colors rounded mt-4 disabled:opacity-50">
              {isLoading ? 'A Salvar...' : 'Salvar Nova Senha'}
            </button>
            <p className="text-center text-zinc-500 text-sm mt-6">
              Lembrou da senha? <button type="button" onClick={() => { window.history.replaceState({}, document.title, "/"); switchView('login', 'Shadow Performance'); }} className="text-white hover:text-red-500 font-bold ml-1 transition-colors">Voltar ao Login</button>
            </p>
          </form>
        )}

        {/* --- VISTA: SUCESSO DO REGISTO --- */}
        {currentView === 'success' && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">{formTitle}</h3>
            <p className="text-zinc-400 mb-8">{globalMessage.text}</p>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded text-zinc-300 text-sm">
              A Acessar à garagem em <span className="text-red-500 font-bold text-lg mx-1">{countdown}</span>s...
            </div>
          </div>
        )}

        {/* --- VISTA: SUCESSO DA RECUPERAÇÃO --- */}
        {currentView === 'recover-success' && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-600/20">
              <MailCheck className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-4">{formTitle}</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Enviamos um link de recuperação para o endereço <br/>
              <span className="font-bold text-white">{email}</span>. <br/>
              Verifique a sua caixa de entrada e a pasta de Spam.
            </p>
            <button type="button" onClick={() => { switchView('login', 'Shadow Performance'); setEmail(''); }} className="w-full bg-zinc-900 border border-zinc-800 text-white font-bold uppercase tracking-widest py-4 hover:bg-zinc-800 hover:border-red-600 transition-colors rounded">
              Voltar ao Login
            </button>
          </div>
        )}

        {/* --- VISTA: LOGIN --- */}
        {currentView === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="O seu e-mail de Piloto" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-red-600 transition-colors rounded placeholder-zinc-600" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Senha</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="A sua senha" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pr-12 focus:outline-none focus:border-red-600 transition-colors rounded placeholder-zinc-600" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-zinc-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-right mt-2">
                <button type="button" onClick={() => switchView('recover', 'Recuperar Senha')} className="text-sm text-zinc-500 hover:text-red-500 transition-colors">Esqueceu sua senha?</button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-4 hover:bg-red-700 transition-colors rounded mt-4 disabled:opacity-50">
              {isLoading ? 'A Acessar...' : 'Acessar à Garagem'}
            </button>
            <p className="text-center text-zinc-500 text-sm mt-6">
              Ainda não tem conta? <button type="button" onClick={() => switchView('register', 'Novo Piloto')} className="text-white hover:text-red-500 font-bold ml-1 transition-colors">Registe-se</button>
            </p>
          </form>
        )}

        {/* --- VISTA: RECUPERAR SENHA --- */}
        {currentView === 'recover' && (
          <form onSubmit={handleRecover} className="space-y-5">
            <p className="text-zinc-400 text-sm text-center mb-6">Indique o e-mail da sua conta para redefinir a senha.</p>
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="O seu e-mail" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-red-600 transition-colors rounded" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-4 hover:bg-red-700 transition-colors rounded mt-4 disabled:opacity-50">
              {isLoading ? 'A enviar...' : 'Enviar Link'}
            </button>
            <p className="text-center text-zinc-500 text-sm mt-6">
              Lembrou-se da senha? <button type="button" onClick={() => switchView('login', 'Shadow Performance')} className="text-white hover:text-red-500 font-bold ml-1 transition-colors">Voltar</button>
            </p>
          </form>
        )}

        {/* --- VISTA: REGISTO --- */}
        {currentView === 'register' && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Nome</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="O seu nome" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-red-600 transition-colors rounded" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="O seu e-mail" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-red-600 transition-colors rounded" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Senha</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pr-12 focus:outline-none focus:border-red-600 transition-colors rounded" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-zinc-500"><Eye className="w-5 h-5" /></button>
              </div>
            </div>
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Confirmar Senha</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pr-12 focus:outline-none focus:border-red-600 transition-colors rounded" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-zinc-500"><Eye className="w-5 h-5" /></button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-4 hover:bg-red-700 transition-colors rounded mt-4 disabled:opacity-50">
              {isLoading ? 'A Criar Conta...' : 'Criar Conta'}
            </button>
            <p className="text-center text-zinc-500 text-sm mt-6">
              Já tem conta? <button type="button" onClick={() => switchView('login', 'Shadow Performance')} className="text-white hover:text-red-500 font-bold ml-1 transition-colors">Iniciar Sessão</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 2. NOVO ECRÃ HOME (MARKETPLACE)
// ==========================================

const TRENDING_PRODUCTS = [
  { id: 'prod-1', name: 'Kit Embreagem Cerâmica 400whp', brand: 'SHADOW', price: 1850.00, oldPrice: 2100.00, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600', isNew: true },
  { id: 'prod-2', name: 'Jogo de Rodas Civic Si 2007 Aro 17', brand: 'HONDA OEM', price: 3500.00, image: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&q=80&w=600', isNew: false },
  { id: 'prod-3', name: 'Projetores LED H4 Alta Intensidade', brand: 'LUMEN', price: 450.00, oldPrice: 580.00, image: 'https://images.unsplash.com/photo-1620541604516-160df646fc89?auto=format&fit=crop&q=80&w=600', isNew: true },
  { id: 'prod-4', name: 'Escape Inox 3 Polegadas', brand: 'SHADOW', price: 1850.00, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600', isNew: false }
];

const CATEGORIES = ['Motor a Ar', 'Suspensão', 'Iluminação', 'Freios', 'Interior', 'Rodas'];

const ShadowPerformanceHome = ({ onLogout }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. EFEITO PARA TRAVAR O SCROLL DA PÁGINA QUANDO O CARRINHO ABRIR
  useEffect(() => {
    if (isCartOpen || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Limpeza caso o componente seja desmontado
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen, isMenuOpen]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => i.id !== productId));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    // 2. REMOVIDO O 'overflow-x-hidden' e 'relative' DA RAIZ
    <div className="min-h-screen bg-black font-sans selection:bg-red-600 selection:text-white">
      
      {/* ========================================================= */}
      {/* ELEMENTOS FIXOS (Fora do container principal de conteúdo) */}
      {/* ========================================================= */}

      {/* BARRA DE NAVEGAÇÃO FIXA */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/85 backdrop-blur-md border-b border-zinc-900 text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 bg-transparent">
          <div className="flex justify-between items-center h-20">
            
            {/* Esquerda: Menu Mobile e Logo */}
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMenuOpen(true)} className="text-zinc-400 hover:text-white transition-colors md:hidden p-1">
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <span className="font-black text-xl md:text-2xl tracking-tighter">
                  SHADOW<span className="text-red-600">PERFORMANCE</span>
                </span>
              </div>
            </div>
            
            {/* Centro: Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#catalogo" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">Shop</a>
              <a href="#" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Projetos</a>
              <a href="#" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Sobre</a>
            </div>

            {/* Direita: Busca, Carrinho e Logout */}
            <div className="flex items-center space-x-2 md:space-x-6">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-2 transition-colors ${isSearchOpen ? 'text-red-600' : 'text-zinc-400 hover:text-white'}`}>
                <Search className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              <button onClick={() => setIsCartOpen(true)} className="text-zinc-400 hover:text-white p-2 relative transition-colors">
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
              
              <button onClick={onLogout} className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-red-600 hover:text-white hover:border-red-600 px-3 py-2 md:px-4 rounded flex items-center gap-2 group transition-all">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-bold uppercase tracking-widest hidden sm:block">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE PESQUISA */}
        <div className={`absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-900 transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? 'h-20 opacity-100' : 'h-0 opacity-0 border-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <Search className="w-5 h-5 text-zinc-600 mr-4" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Procure por peças, marcas ou projetos..." className="w-full bg-transparent text-white text-lg md:text-xl focus:outline-none placeholder-zinc-600 font-light" />
            <button onClick={() => { if (searchQuery) setSearchQuery(''); else setIsSearchOpen(false); }} className="text-zinc-500 hover:text-red-500 ml-4 p-2 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* MENU LATERAL MOBILE */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex justify-start">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-[85%] max-w-sm bg-zinc-950 border-r border-zinc-900 h-[100dvh] flex flex-col shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-black">
              <span className="font-black text-xl tracking-tighter text-white">SHADOW<span className="text-red-600">PERFORMANCE</span></span>
              <button onClick={() => setIsMenuOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-950">
              <nav className="flex flex-col space-y-8 text-lg font-black uppercase tracking-widest text-zinc-400">
                <a href="#catalogo" onClick={() => setIsMenuOpen(false)} className="hover:text-white hover:translate-x-2 transition-all flex items-center justify-between group">Shop <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:text-red-600 transition-all" /></a>
                <a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-white hover:translate-x-2 transition-all flex items-center justify-between group">Projetos <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:text-red-600 transition-all" /></a>
                <a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-white hover:translate-x-2 transition-all flex items-center justify-between group">Sobre Nós <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:text-red-600 transition-all" /></a>
                <div className="w-full h-px bg-zinc-900 my-4"></div>
                <a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3"><User className="w-5 h-5" /> Minha Garagem</a>
              </nav>
            </div>
            <div className="p-6 border-t border-zinc-900 bg-black">
              <button onClick={() => { setIsMenuOpen(false); onLogout(); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-red-600 hover:border-red-600 text-white font-bold py-4 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                <LogOut className="w-4 h-4" /> Sair da Conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARRINHO LATERAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-900 h-[100dvh] flex flex-col shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Sua Garagem</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <p className="text-zinc-500 text-center mt-10">Seu carrinho está vazio.</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-black p-3 border border-zinc-900 rounded">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-zinc-900" />
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-bold leading-tight">{item.name}</h4>
                      <p className="text-zinc-500 text-xs mt-1">Qtd: {item.quantity}</p>
                      <p className="text-red-500 font-bold mt-1">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-zinc-600 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-zinc-900 bg-black">
                <div className="flex justify-between items-center mb-4 text-white">
                  <span className="font-bold uppercase text-zinc-400">Total</span>
                  <span className="text-2xl font-black">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded uppercase tracking-widest transition-colors">
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONTEÚDO DA PÁGINA (Isolado com overflow oculto)          */}
      {/* ========================================================= */}
      <main className="relative overflow-x-hidden">
        
        {/* HERO SECTION */}
        <section className="relative w-full h-screen flex items-center justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1920" alt="Performance Car" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-16">
            <span className="text-red-600 font-bold uppercase tracking-[0.3em] mb-4 text-sm">Não aceite o original de fábrica</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-lg">
              Driven By <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Performance</span>
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl font-light mb-10 max-w-2xl leading-relaxed">
              Peças e projetos de alta performance desenvolvidos para quem respira a cultura automotiva e não conhece limites na pista ou na rua.
            </p>
            <a href="#catalogo" className="bg-white text-black hover:bg-zinc-200 font-black px-10 py-4 uppercase tracking-widest rounded transition-colors flex items-center gap-2 group">
              Explorar Peças <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>

        {/* BARRA DE CATEGORIAS */}
        <div className="bg-zinc-950 border-y border-zinc-900 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto pb-2 scrollbar-hide text-sm font-bold uppercase tracking-wider text-zinc-500 justify-start md:justify-center">
              {CATEGORIES.map((cat, idx) => (
                <button key={idx} className="whitespace-nowrap hover:text-white transition-colors">{cat}</button>
              ))}
            </div>
          </div>
        </div>

        {/* SECÇÃO DE LOJA */}
        <section id="catalogo" className="bg-black py-24 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-900 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2"><Flame className="w-5 h-5 text-red-600" /><span className="text-red-600 font-bold uppercase tracking-widest text-sm">Novidades</span></div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Lançamentos</h2>
              </div>
              <button className="text-zinc-400 hover:text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2 mt-4 md:mt-0 transition-colors">
                Ver Catálogo Completo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {TRENDING_PRODUCTS.map((product) => (
                <div key={product.id} className="group flex flex-col bg-black border border-zinc-900 rounded hover:border-zinc-700 transition-colors relative">
                  {product.isNew && <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Novo</span>}
                  <div className="relative aspect-square overflow-hidden bg-zinc-950 rounded-t p-6 flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="object-cover w-full h-full opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 mix-blend-lighten" />
                  </div>
                  <div className="flex flex-col flex-grow p-5 border-t border-zinc-900">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{product.brand}</span>
                    <h3 className="text-white font-bold text-base leading-tight mb-3 group-hover:text-red-500 transition-colors line-clamp-2 min-h-[40px]">{product.name}</h3>
                    <div className="mt-auto flex items-end justify-between mb-4">
                      <div>
                        {product.oldPrice && <span className="block text-zinc-600 line-through text-xs mb-0.5">R$ {product.oldPrice.toFixed(2)}</span>}
                        <span className="text-xl font-black text-white">R$ {product.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <button onClick={() => addToCart(product)} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-red-600 hover:border-red-600 text-white font-bold py-3 rounded transition-all uppercase tracking-wider text-sm">
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIFESTYLE */}
        <section className="border-t border-zinc-900 bg-zinc-950 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 md:p-24 flex flex-col justify-center">
              <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4">Cultura Automotiva</span>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">Construído na Garagem. Testado na Pista.</h2>
              <p className="text-zinc-400 text-lg font-light mb-8 leading-relaxed">
                Nós não vendemos apenas peças. Nós vivemos os projetos. Desde setups aspirados de alta rotação até projetos turbo de rua, nossa curadoria de peças é feita por quem tem graxa na mão.
              </p>
              <a href="#" className="self-start border-b-2 border-red-600 text-white font-bold uppercase tracking-widest pb-1 hover:text-red-500 transition-colors">
                Conheça nossa História
              </a>
            </div>
            <div className="relative h-[400px] lg:h-auto">
              <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000" alt="Garagem Project" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black border-t border-zinc-900 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="md:col-span-2">
                <span className="font-black text-2xl tracking-tighter text-white block mb-6">SHADOW<span className="text-red-600">PERFORMANCE</span></span>
                <p className="text-zinc-500 font-light max-w-sm mb-6">Equipando a próxima geração de entusiastas com peças premium e suporte técnico de quem entende do assunto.</p>
              </div>
              <div>
                <h4 className="text-white font-bold uppercase tracking-widest mb-6">Loja</h4>
                <ul className="space-y-4 text-zinc-500 text-sm">
                  <li><a href="#" className="hover:text-red-500 transition-colors">Lançamentos</a></li>
                  <li><a href="#" className="hover:text-red-500 transition-colors">Marcas</a></li>
                  <li><a href="#" className="hover:text-red-500 transition-colors">Rastrear Pedido</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold uppercase tracking-widest mb-6">Suporte</h4>
                <ul className="space-y-4 text-zinc-500 text-sm">
                  <li><a href="#" className="hover:text-red-500 transition-colors">Garantia e Devoluções</a></li>
                  <li><a href="#" className="hover:text-red-500 transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-red-500 transition-colors">Contato</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-zinc-600 text-xs">© 2026 Shadow Performance. Todos os direitos reservados.</p>
              <div className="flex space-x-6 text-zinc-600 text-xs font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Termos</a>
                <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};

// ==========================================
// 3. O ROUTER PRINCIPAL (APP)
// ==========================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('olympus_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('olympus_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('olympus_auth'); 
    setIsAuthenticated(false); 
  };

  if (isAuthenticated) {
    return <ShadowPerformanceHome onLogout={handleLogout} />;
  }

  return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
}