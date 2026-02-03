
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Inventory } from './views/Inventory';
import { Simulator } from './views/Simulator';
import { Login } from './views/Login';
import { Product } from './types';
import { dbService } from './services/dbService';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Café Gourmet 500g', category: 'Alimentos', cost: 15, currentPrice: 35, monthlySales: 120, description: 'Grãos selecionados com torra média e notas achocolatadas.' },
  { id: '2', name: 'Caneca Cerâmica Artística', category: 'Utensílios', cost: 8, currentPrice: 28, monthlySales: 45, description: 'Caneca feita à mão com design exclusivo minimalista.' },
  { id: '3', name: 'Smartphone Pro Max 128GB', category: 'Eletrônicos', cost: 3200, currentPrice: 4500, monthlySales: 15, description: 'Último modelo com câmera tripla e processador de alta performance.' },
  { id: '4', name: 'Camiseta Algodão Pima', category: 'Vestuário', cost: 35, currentPrice: 89, monthlySales: 210, description: 'Camiseta básica de alta durabilidade e toque extra macio.' },
  { id: '5', name: 'Vinho Tinto Malbec Reserva', category: 'Bebidas', cost: 45, currentPrice: 110, monthlySales: 60, description: 'Vinho encorpado com 12 meses de maturação em barril de carvalho.' },
  { id: '6', name: 'Fone Bluetooth Noise Cancelling', category: 'Eletrônicos', cost: 180, currentPrice: 399, monthlySales: 85, description: 'Cancelamento ativo de ruído e bateria de longa duração.' },
  { id: '7', name: 'Kit Home Office Ergonômico', category: 'Escritório', cost: 120, currentPrice: 250, monthlySales: 30, description: 'Suporte para notebook e mousepad ergonômico de alta densidade.' }
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'simulator'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Carregar sessão e produtos ao iniciar
  useEffect(() => {
    const session = localStorage.getItem('axion_session');
    if (session === 'true') {
      setIsLoggedIn(true);
    }

    const loadData = async () => {
      const data = await dbService.getProducts(INITIAL_PRODUCTS);
      setProducts(data);
    };
    loadData();
  }, []);

  // Salvar sempre que a lista de produtos mudar
  useEffect(() => {
    if (products.length > 0 && isLoggedIn) {
      setIsSyncing(true);
      dbService.saveProducts(products).then(() => {
        setTimeout(() => setIsSyncing(false), 800);
      });
    }
  }, [products, isLoggedIn]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      localStorage.setItem('axion_session', 'true');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('axion_session');
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openSimulator = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('simulator');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      <div className="relative">
        {/* Status de Sincronização */}
        <div className={`fixed top-4 right-4 z-[60] flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm transition-all duration-500 transform ${isSyncing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Dados Sincronizados</span>
        </div>

        {activeTab === 'dashboard' && (
          <Dashboard products={products} onNavigateSimulator={(p) => openSimulator(p)} />
        )}
        {activeTab === 'inventory' && (
          <Inventory 
            products={products} 
            onAddProduct={addProduct} 
            onDeleteProduct={deleteProduct} 
            onSimulate={openSimulator}
          />
        )}
        {activeTab === 'simulator' && (
          <Simulator 
            products={products} 
            initialProduct={selectedProduct} 
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
