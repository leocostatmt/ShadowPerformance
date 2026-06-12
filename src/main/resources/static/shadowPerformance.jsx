import React, { useState } from 'react';
import { 
  Search, ShoppingCart, User, Menu, ChevronRight, Zap, 
  Flame, Star, ArrowRight, X, Filter, Trash2, Plus, Minus, Check 
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = [
  { id: 'cat-1', name: 'Motor & Turbo', image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800' },
  { id: 'cat-2', name: 'Suspensão & Freios', image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=800' },
  { id: 'cat-3', name: 'Eletrônica & ECU', image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=800' }
];

const TRENDING_PRODUCTS = [
  { id: 'prod-1', name: 'Volante Esportivo Suede', brand: 'SHADOW', price: 650.00, oldPrice: 800.00, image: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&q=80&w=600', isNew: true, rating: 5 },
  { id: 'prod-2', name: 'Kit Freio Big Brake 6 Pistões', brand: 'STOPTECH', price: 4500.00, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600', isNew: false, rating: 4.8 },
  { id: 'prod-3', name: 'Turbina Roletada .70', brand: 'MASTER POWER', price: 3200.00, oldPrice: 3500.00, image: 'https://images.unsplash.com/photo-1620541604516-160df646fc89?auto=format&fit=crop&q=80&w=600', isNew: true, rating: 5 },
  { id: 'prod-4', name: 'Escape Inox 3 Polegadas', brand: 'SHADOW', price: 1850.00, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600', isNew: false, rating: 4.9 }
];

const INITIAL_CART = [
  { id: 'prod-1', name: 'Volante Esportivo Suede', price: 650.00, quantity: 1, image: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&q=80&w=600' },
  { id: 'prod-4', name: 'Escape Inox 3 Polegadas', price: 1850.00, quantity: 1, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600' }
];

// --- COMPONENTS ---

export default function ShadowPerformanceHome() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const updateQuantity = (id, delta) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-red-600 selection:text-white relative">
      
      {/* --- OVERLAYS --- */}
      {(isCartOpen || isFilterOpen) && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => { setIsCartOpen(false); setIsFilterOpen(false); }}
        />
      )}

      {/* --- SIDE CART MODAL --- */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-zinc-950 border-l border-zinc-900 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Seu Carrinho <span className="text-red-600">({cartItems.length})</span></h2>
          <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-zinc-500 text-center mt-10">Seu carrinho está vazio.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4 bg-zinc-900/50 p-3 border border-zinc-800">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
                <div className="flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-white font-bold leading-tight line-clamp-2">{item.name}</h3>
                    <p className="text-red-500 font-black mt-1">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-black border border-zinc-800 rounded">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-zinc-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                      <span className="text-white text-sm font-bold w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-zinc-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-zinc-900 bg-black">
          <div className="flex justify-between items-center mb-6">
            <span className="text-zinc-400 font-bold uppercase tracking-wider">Subtotal</span>
            <span className="text-3xl font-black text-white">R$ {cartTotal.toFixed(2)}</span>
          </div>
          <button className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-4 hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            Finalizar Compra <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- FILTER SIDEBAR MODAL --- */}
      <div className={`fixed top-0 left-0 h-full w-full sm:w-[350px] bg-zinc-950 border-r border-zinc-900 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-red-600" />
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Filtros</h2>
          </div>
          <button onClick={() => setIsFilterOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {/* Marca */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">Marca</h3>
            <div className="space-y-3">
              {['SHADOW', 'FuelTech', 'Master Power', 'SPA Turbo'].map((brand, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 border border-zinc-700 flex items-center justify-center group-hover:border-red-500 transition-colors">
                    {i === 0 && <Check className="w-3 h-3 text-red-500" />}
                  </div>
                  <span className="text-zinc-400 group-hover:text-white transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">Categoria</h3>
            <div className="space-y-3">
              {['Motor & Interna', 'Turbos & Kits', 'Injeção Eletrônica', 'Suspensão'].map((cat, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 border border-zinc-700 flex items-center justify-center group-hover:border-red-500 transition-colors"></div>
                  <span className="text-zinc-400 group-hover:text-white transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preço */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">Preço</h3>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 focus:outline-none focus:border-red-600 placeholder-zinc-600" />
              <span className="text-zinc-500">-</span>
              <input type="number" placeholder="Max" className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 focus:outline-none focus:border-red-600 placeholder-zinc-600" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-900 bg-black flex gap-3">
          <button className="flex-1 border border-zinc-700 text-white font-bold uppercase tracking-wider py-3 hover:bg-zinc-900 transition-colors">Limpar</button>
          <button className="flex-1 bg-white text-black font-black uppercase tracking-wider py-3 hover:bg-zinc-200 transition-colors" onClick={() => setIsFilterOpen(false)}>Aplicar</button>
        </div>
      </div>


      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center md:hidden">
              <button className="text-zinc-400 hover:text-white p-2"><Menu className="h-6 w-6" /></button>
            </div>

            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="font-black text-2xl tracking-tighter">
                SHADOW<span className="text-red-600">PERFORMANCE</span>
              </span>
            </div>

            <div className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-red-500 transition-colors">Shop</a>
              <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-red-500 transition-colors">Brands</a>
              <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-red-500 transition-colors">Builds</a>
              <a href="#" className="text-sm font-bold uppercase tracking-widest text-red-600 hover:text-red-500 transition-colors">Sale</a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center bg-zinc-900 rounded-full px-4 py-2 border border-zinc-800 focus-within:border-red-600 transition-colors">
                <Search className="h-4 w-4 text-zinc-400" />
                <input type="text" placeholder="Buscar peças..." className="bg-transparent border-none text-sm text-white focus:outline-none ml-2 w-48 placeholder-zinc-500" />
              </div>
              <button className="text-zinc-400 hover:text-white p-2 relative group"><User className="h-5 w-5 group-hover:text-red-500 transition-colors" /></button>
              
              {/* Trigger Carrinho */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-zinc-400 hover:text-white p-2 relative group cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <div className="relative bg-black h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=2000" alt="JDM Car at Night" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6 inline-flex items-center gap-2">
            <Flame className="w-4 h-4" /> Nova Coleção Hype
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
            Defina as <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Suas Regras</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto font-light mb-10">
            Peças de alta performance desenvolvidas para quem vive o asfalto. Eleve o nível do seu projeto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-black font-black uppercase tracking-widest px-8 py-4 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
              Comprar Agora <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- TRENDING / SHOP SECTION --- */}
      <section className="bg-black py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Catálogo</span>
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Peças em Destaque</h2>
            </div>
            
            <div className="flex items-center gap-4 mt-6 md:mt-0">
              {/* Trigger Filtros */}
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 border border-zinc-700 bg-zinc-900 px-6 py-2 text-white font-bold uppercase tracking-widest text-sm hover:border-red-500 transition-colors"
              >
                <Filter className="w-4 h-4" /> Filtrar
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRENDING_PRODUCTS.map((product) => (
              <div key={product.id} className="group flex flex-col bg-black cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 mb-4">
                  {product.isNew && <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">Novo</span>}
                  
                  {/* Botão de Add to Cart rápido */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCartOpen(true);
                      // Lógica de add to cart iria aqui
                    }}
                    className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full backdrop-blur-sm"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{product.brand}</span>
                  <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-red-500 transition-colors">{product.name}</h3>
                  <div className="mt-auto flex items-center space-x-3">
                    <span className="text-xl font-black text-white">R$ {product.price.toFixed(2)}</span>
                    {product.oldPrice && <span className="text-sm font-medium text-zinc-500 line-through">R$ {product.oldPrice.toFixed(2)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}