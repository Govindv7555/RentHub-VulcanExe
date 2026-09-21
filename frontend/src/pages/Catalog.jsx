import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockListings, categories } from '../data/mockData';
import { Search, Star, SlidersHorizontal, Info, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  
  const { addToCart } = useCart();
  
  // Filtering
  const filteredListings = mockListings.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (item) => {
    addToCart({ ...item, price: item.price_per_day_paise / 100 });
  };

  return (
    <div className="flex-1 bg-background text-textMain pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Top Header & Search */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-surfaceLight pb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {activeCategory === 'All' ? 'Equipment Catalog' : `${activeCategory} rentals`}
            </h1>
            <p className="text-textMuted text-sm">Showing {filteredListings.length} available items</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-4">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field w-full pl-10"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
            </div>
            <button className="btn-outline flex items-center gap-2">
              <span className="hidden sm:inline">By popularity</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0 space-y-6">
            
            {/* Filter by Location */}
            <div className="card p-5">
               <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider flex items-center">
                 Location
               </h3>
               <select className="input-field w-full text-sm appearance-none cursor-pointer">
                 <option>All locations</option>
                 <option>Mumbai, MH</option>
                 <option>New Delhi, DL</option>
                 <option>Chennai, TN</option>
               </select>
               <ChevronDown size={14} className="absolute right-9 mt-[-24px] pointer-events-none text-textMuted" />
            </div>

            {/* Filter by Category */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider flex items-center">
                <SlidersHorizontal size={16} className="mr-2" /> Class
              </h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveCategory('All')}
                    className={cn(
                      "text-sm w-full text-left py-1 hover:text-amber transition-colors flex justify-between",
                      activeCategory === 'All' ? "text-amber font-semibold" : "text-textMuted"
                    )}
                  >
                    All Equipment
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setActiveCategory(cat.name)}
                      className={cn(
                        "text-sm w-full text-left py-1 hover:text-amber transition-colors flex justify-between",
                        (activeCategory.toLowerCase() === cat.name.toLowerCase()) ? "text-amber font-semibold" : "text-textMuted"
                      )}
                    >
                      {cat.name}
                      <span className="text-xs opacity-50">{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
              
              <button 
                className="mt-6 w-full btn-outline text-xs uppercase tracking-wider py-2"
                onClick={() => { setActiveCategory('All'); setSearch(''); }}
              >
                Reset Filters
              </button>
            </div>

            {/* Price Slider mockup */}
            <div className="card p-5">
               <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">
                 Price range
               </h3>
               <div className="h-1 bg-surfaceLight rounded mt-4 mb-6 relative">
                 <div className="absolute left-[20%] right-[30%] bg-amber h-1 rounded"></div>
                 <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-amber rounded-full cursor-pointer"></div>
                 <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-amber rounded-full cursor-pointer"></div>
               </div>
               <div className="flex justify-between items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-textMuted uppercase mb-1">From:</span>
                    <div className="bg-background border border-surfaceLight rounded px-2 py-1 text-sm">₹500</div>
                  </div>
                  <span className="text-surfaceLight">-</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-textMuted uppercase mb-1">To:</span>
                    <div className="bg-background border border-surfaceLight rounded px-2 py-1 text-sm">₹8000</div>
                  </div>
               </div>
            </div>

            {/* Payment Methods (Visual Mockup from spec) */}
            <div className="card p-5 bg-surface/50">
              <h3 className="text-sm font-semibold mb-2 text-white">Payment Methods</h3>
              <p className="text-xs text-textMuted mb-4 leading-relaxed">We accept the following secured methods via escrow.</p>
              <div className="flex gap-2 mb-6">
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-xs italic">VISA</span>
                </div>
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center relative overflow-hidden">
                   <div className="w-5 h-5 bg-red-500 rounded-full absolute -left-1"></div>
                   <div className="w-5 h-5 bg-yellow-500 rounded-full absolute -right-1 mix-blend-multiply"></div>
                </div>
              </div>
              <p className="text-[10px] text-amber uppercase font-semibold text-center border border-amber/30 rounded py-1">Fully Insured Transactions</p>
            </div>

          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {filteredListings.length === 0 ? (
              <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed">
                <div className="w-16 h-16 bg-surfaceLight rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-textMuted" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">No listings found</h3>
                <p className="text-textMuted">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              filteredListings.map(listing => (
                <div key={listing.id} className="card p-0 overflow-hidden flex flex-col sm:flex-row group transition-colors hover:border-amber/30">
                  {/* Left: Image */}
                  <div className="sm:w-64 h-48 sm:h-auto bg-background relative border-r border-surfaceLight shrink-0">
                    <img src={listing.thumbnail} alt={listing.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    {listing.withDriver && (
                       <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2 py-1 rounded-sm text-[10px] font-bold text-white border border-surfaceLight flex items-center shadow-md">
                         <Info size={10} className="mr-1 text-amber" /> WITH DRIVER
                       </div>
                    )}
                  </div>
                  
                  {/* Right: Info */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <Link to={`/listing/${listing.id}`} className="font-semibold text-lg text-white leading-tight hover:text-amber transition-colors">
                          {listing.title}
                        </Link>
                        <div className="flex items-center text-xs shrink-0">
                           <span className="text-amber flex items-center border border-amber/20 bg-amber/5 px-2 py-1 rounded">
                             <Star size={12} fill="currentColor" className="mr-1" /> 
                             <span className="font-semibold">{listing.rating}</span>
                           </span>
                        </div>
                      </div>
                      <p className="text-textMuted text-sm max-w-lg mb-3">
                         {listing.description}
                      </p>
                      <div className="text-xs text-textMuted font-mono">
                        Max Dig Depth 16' - 20' • Requires valid KYC
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-4 border-t border-surfaceLight border-dashed">
                      <div className="flex gap-6">
                        <div>
                          <p className="text-textMuted text-[10px] uppercase tracking-wider mb-1">Daily</p>
                          <p className="text-xl font-bold text-white">₹{(listing.price_per_day_paise / 100).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-textMuted text-[10px] uppercase tracking-wider mb-1">Weekly</p>
                          <p className="text-xl font-bold text-white/50">₹{(listing.price_per_week_paise / 100).toLocaleString()}</p>
                        </div>
                        <div className="hidden lg:block">
                          <p className="text-textMuted text-[10px] uppercase tracking-wider mb-1">4 weeks</p>
                          <p className="text-xl font-bold text-white/50">₹{(listing.price_per_month_paise / 100).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleAdd(listing)}
                        className="btn-primary py-2 px-8 w-full sm:w-auto uppercase tracking-wider text-xs"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {filteredListings.length > 0 && (
               <div className="text-center pt-8">
                  <button className="text-amber hover:text-amberHover transition-colors text-sm font-semibold uppercase tracking-wider">
                     See all options (31) →
                  </button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
