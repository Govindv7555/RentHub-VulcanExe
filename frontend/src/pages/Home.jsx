import { Link } from 'react-router-dom';
import { categories, mockListings } from '../data/mockData';
import { Search, Star, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { addToCart } = useCart();

  const handleAdd = (item) => {
    addToCart({ ...item, price: item.price_per_day_paise / 100 });
  };

  return (
    <main className="flex-1 w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 px-4 md:px-8 border-b border-surfaceLight overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2938&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-[1]" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-surfaceLight text-textMuted text-xs font-semibold mb-6 uppercase tracking-widest border border-white/5">
              Secure <span className="text-amber mx-1">•</span> Insured <span className="text-amber mx-1">•</span> Reliable
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              The platform <br/>
              for renting <span className="text-amber">everything</span>
            </h1>
            <p className="text-lg text-textMuted mb-10 max-w-md leading-relaxed">
              From heavy machinery to household tools. Trust-verified rentals with integrated insurance and secure delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog" className="btn-primary hover:-translate-y-1 transform transition-transform text-center flex items-center justify-center space-x-2 shadow-lg shadow-amber/20">
                <Search size={18} />
                <span>SEARCH EQUIPMENT</span>
              </Link>
            </div>
          </div>
          
          {/* Right side floating elements (placeholder for 3D elements in real app) */}
          <div className="hidden md:flex flex-1 justify-center align-middle relative h-[400px]">
             <div className="absolute top-10 right-10 p-4 border border-surfaceLight bg-surface/80 backdrop-blur rounded-xl shadow-2xl animate-pulse">
                <div className="h-6 w-32 bg-amber rounded mb-2"></div>
                <div className="h-4 w-48 bg-white/20 rounded"></div>
             </div>
             <div className="absolute bottom-10 left-0 p-4 border border-amber/30 bg-surface/90 backdrop-blur rounded-xl shadow-[0_0_30px_rgba(245,166,35,0.15)] flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-amber/20 flex items-center justify-center text-amber">
                   <Star size={24} fill="currentColor" />
                </div>
                <div>
                   <p className="font-bold text-white">Verified Users</p>
                   <p className="text-sm text-textMuted">KYC & Face Match</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="bg-surface py-6 border-b border-surfaceLight overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-8 items-center min-w-max">
          <span className="text-xs uppercase tracking-widest text-textMuted font-semibold mr-4">Browse by</span>
          {categories.map(cat => (
            <Link key={cat.id} to={`/catalog?category=${cat.name.toLowerCase()}`} className="group flex items-center space-x-3 cursor-pointer">
              <span className="text-2xl grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{cat.icon}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white group-hover:text-amber transition-colors">{cat.name}</span>
                <span className="text-xs text-textMuted">{cat.count.toLocaleString()} class</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured rentals</h2>
            <p className="text-textMuted">Available for instant booking</p>
          </div>
          <Link to="/catalog" className="text-amber hover:text-amberHover transition-colors text-sm font-semibold uppercase tracking-wider">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockListings.slice(0, 3).map((item) => (
            <div key={item.id} className="card group hover:border-amber/50 transition-colors p-5 flex flex-col">
              <div className="relative h-48 rounded bg-background overflow-hidden mb-4 border border-surfaceLight">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                {item.withDriver && (
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white border border-surfaceLight flex items-center shadow-lg">
                    <Info size={12} className="mr-1 text-amber" /> With driver
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-white leading-tight">{item.title}</h3>
              </div>
              
              <div className="flex items-center space-x-1 mb-4 text-xs">
                <span className="text-amber flex items-center">
                  <Star size={12} fill="currentColor" className="mr-1" /> {item.rating}
                </span>
                <span className="text-surfaceLight">•</span>
                <span className="text-textMuted uppercase">{item.owner.name}</span>
                {item.owner.verified && (
                  <span className="px-1 text-[10px] bg-amber/10 text-amber rounded" title="KYC Verified">✓ KYC</span>
                )}
              </div>
              
              <div className="border-t border-surfaceLight pt-4 mt-auto flex justify-between items-end">
                <div>
                  <p className="text-textMuted text-xs mb-1 uppercase tracking-wider">Daily</p>
                  <p className="text-xl font-bold text-white">₹{(item.price_per_day_paise / 100).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => handleAdd(item)}
                  className="btn-primary text-xs px-4 py-2 opacity-90 group-hover:opacity-100 transition-opacity"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Demo Badge */}
      <div className="fixed bottom-4 right-4 bg-background/90 backdrop-blur border border-amber/30 p-4 rounded shadow-2xl z-50 animate-fade-in-up">
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-amber animate-pulse"></div>
            <p className="text-xs font-semibold tracking-wider text-amber uppercase">Mock Environment</p>
         </div>
         <p className="text-[10px] text-textMuted mt-1 max-w-[200px]">
           DigiLocker, Face Match & eSign are operating in Sandbox mode.
         </p>
      </div>
    </main>
  );
}
