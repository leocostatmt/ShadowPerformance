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
  // ADICIONADO: 'recover-success' à lista de views
  const [currentView, setCurrentView] = useState('login'); 
  const [formTitle, setFormTitle] = useState('Shadow Performance');
  
  // Estados do Formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Capturar o TOKEN do URL (se o utilizador veio pelo link do e-mail)
  const [resetToken, setResetToken] = useState('');
  
  // Estados da Interface
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalMessage, setGlobalMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(3);

  // Validações em tempo real
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  // Efeito: Detetar o link do e-mail ao carregar a página
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParams = params.get('token');
    
    if (tokenParams) {
      setResetToken(tokenParams);
      setCurrentView('reset');
      setFormTitle('Nova Senha');
    }
  }, []);

  // Limpa mensagens de erro ao escrever
  useEffect(() => {
    setGlobalMessage({ type: '', text: '' });
  }, [email, password, name, confirmPassword]);

  // Efeito para a contagem decrescente do Registo com Sucesso
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

  // --- LIGAÇÃO À API JAVA (Porta 8080) ---

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
        // === MUDA PARA A NOVA TELA DE SUCESSO DE E-MAIL ===
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
        {/* Oculta o título principal se estivermos em telas de sucesso dedicadas */}
        {currentView !== 'success' && currentView !== 'recover-success' && (
          <h2 className="text-3xl font-black text-white text-center uppercase tracking-wider mb-8">
            {formTitle === 'Shadow Performance' ? (
              <>SHADOW<span className="text-red-600">PERFORMANCE</span></>
            ) : formTitle}
          </h2>
        )}

        {/* MENSAGEM GLOBAL */}
        {globalMessage.text && currentView !== 'success' && (
          <div className={`p-4 rounded mb-6 flex items-start gap-3 ${globalMessage.type === 'error' ? 'bg-red-500/10 border border-red-500/50 text-red-500' : 'bg-green-500/10 border border-green-500/50 text-green-500'}`}>
            {globalMessage.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
            <span className="text-sm font-medium">{globalMessage.text}</span>
          </div>
        )}

        {/* --- VISTA: REDEFINIR SENHA (NOVA) --- */}
        {currentView === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
            <p className="text-zinc-400 text-sm text-center mb-6">
              O seu token foi validado. Crie agora a sua nova senha.
            </p>
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Nova Senha</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres" required className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pr-12 focus:outline-none focus:border-red-600 transition-colors rounded" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-zinc-500"><Eye className="w-5 h-5" /></button>
              </div>
              {/* Regras Dinâmicas de Senha */}
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

        {/* --- VISTA: SUCESSO DA RECUPERAÇÃO (E-MAIL ENVIADO) --- */}
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
            
            <button 
              type="button" 
              onClick={() => { switchView('login', 'Shadow Performance'); setEmail(''); }} 
              className="w-full bg-zinc-900 border border-zinc-800 text-white font-bold uppercase tracking-widest py-4 hover:bg-zinc-800 hover:border-red-600 transition-colors rounded"
            >
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
  { id: 'prod-1', name: 'Volante Desportivo Suede', brand: 'SHADOW', price: 650.00, oldPrice: 800.00, image: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&q=80&w=600', isNew: true },
  { id: 'prod-2', name: 'Kit Travagem Big Brake 6 Pistões', brand: 'STOPTECH', price: 4500.00, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600', isNew: false },
  { id: 'prod-3', name: 'Turbina Rolamentada .70', brand: 'MASTER POWER', price: 3200.00, oldPrice: 3500.00, image: 'https://images.unsplash.com/photo-1620541604516-160df646fc89?auto=format&fit=crop&q=80&w=600', isNew: true },
  { id: 'prod-4', name: 'Escape Inox 3 Polegadas', brand: 'SHADOW', price: 1850.00, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600', isNew: false }
];

const ShadowPerformanceHome = ({ onLogout }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-red-600 selection:text-white relative">
      
      {/* BARRA DE NAVEGAÇÃO */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="font-black text-2xl tracking-tighter">SHADOW<span className="text-red-600">PERFORMANCE</span></span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsCartOpen(true)} className="text-zinc-400 hover:text-white p-2 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartItems.length}</span>}
              </button>
              
              <button 
                onClick={onLogout} 
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-red-600 hover:text-white hover:border-red-600 px-4 py-2 rounded flex items-center gap-2 group transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-bold uppercase tracking-widest">Sair da Conta</span>
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* SECÇÃO DE LOJA */}
      <section className="bg-black py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2"><Zap className="w-5 h-5 text-red-600" /><span className="text-red-600 font-bold uppercase tracking-widest text-sm">Catálogo</span></div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Peças em Destaque</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRENDING_PRODUCTS.map((product) => (
              <div key={product.id} className="group flex flex-col bg-black border border-zinc-900 p-4 rounded hover:border-red-600 transition-colors">
                <div className="relative aspect-square overflow-hidden bg-zinc-900 mb-4 rounded">
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{product.brand}</span>
                  <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-red-500">{product.name}</h3>
                  <div className="mt-auto flex items-center space-x-3 mb-4">
                    <span className="text-xl font-black text-white">{product.price.toFixed(2)} €</span>
                  </div>
                  <button onClick={() => addToCart(product)} className="w-full bg-zinc-900 hover:bg-red-600 text-white font-bold py-3 rounded transition-colors uppercase tracking-wider text-sm">Adicionar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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