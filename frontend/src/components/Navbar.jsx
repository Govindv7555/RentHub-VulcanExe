import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  
  const [location, setLocation] = useState('New Delhi, DL');

  const links = [
    { name: 'HOME', path: '/' },
    { name: 'CATALOG', path: '/catalog' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'CONTACTS', path: '/contacts' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#121212] border-b border-surfaceLight/50 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-white">RENT</span><span className="text-amber">HUB</span>
          </Link>
          
          {/* Location Picker Trigger */}
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden lg:flex items-center text-xs font-semibold text-textMuted hover:text-white transition-colors bg-surfaceLight/30 px-3 py-1.5 rounded border border-surfaceLight"
          >
            <MapPin size={12} className="mr-2 text-amber" /> {location}
          </button>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="text-white/70 hover:text-amber text-xs font-medium tracking-[0.1em] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Nav (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="flex items-center space-x-2 text-white/70 hover:text-amber transition-colors">
                <User size={16} />
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
              <button 
                onClick={logout}
                className="text-white/50 text-xs hover:text-white transition-colors uppercase tracking-widest"
              >
                Logout
              </button>
            </div>
          ) : (
             <Link to="/login" className="text-white/70 hover:text-amber text-xs font-medium tracking-[0.1em] transition-colors">
               LOGIN
             </Link>
          )}

          <Link to="/cart" className="flex items-center space-x-2 group">
            <span className="text-white/70 group-hover:text-amber text-xs font-medium tracking-[0.1em] transition-colors">
              CART {cartItems.length > 0 && <span className="text-amber">({cartItems.length})</span>}
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white/70" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden py-4 border-t border-surfaceLight mt-4 flex flex-col space-y-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-white/70 hover:text-amber text-xs font-medium tracking-[0.1em]"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/cart" className="text-white/70 hover:text-amber text-xs font-medium tracking-[0.1em]">
            CART ({cartItems.length})
          </Link>
          {!user ? (
            <Link to="/login" className="text-white/70 hover:text-amber text-xs font-medium tracking-[0.1em]">
              LOGIN
            </Link>
          ) : (
            <>
              <Link to="/dashboard" className="text-white/70 hover:text-amber text-xs font-medium tracking-[0.1em]">
                DASHBOARD
              </Link>
              <button onClick={logout} className="text-left text-white/70 hover:text-amber text-xs font-medium tracking-[0.1em]">
                LOGOUT
              </button>
            </>
          )}
        </div>
      )}
      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-surfaceLight rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surfaceLight flex justify-between items-center bg-surfaceLight/30">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Select Your Location</h3>
              <button onClick={() => setIsLocationModalOpen(false)} className="text-textMuted hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            {/* Interactive Map Picker (Mock) */}
            <div className="w-full h-80 bg-surface relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=60')] bg-cover bg-center">
               <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]"></div>
               <div className="relative z-10 flex flex-col items-center justify-center h-full cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                  <MapPin size={48} className="text-amber drop-shadow-lg" />
                  <div className="w-6 h-1.5 bg-black/50 blur-md rounded-full mt-2"></div>
               </div>
               
               <div className="absolute top-4 left-4 right-4 z-20">
                 <input type="text" className="input-field w-full bg-background/90 backdrop-blur shadow-lg border-surfaceLight" placeholder="Search for city, neighborhood or zip code..." defaultValue={location} />
               </div>
            </div>
            
            <div className="p-4 flex justify-end gap-4 bg-background">
              <button className="btn-outline" onClick={() => setIsLocationModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { setLocation('New Delhi, DL'); setIsLocationModalOpen(false); }}>
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
