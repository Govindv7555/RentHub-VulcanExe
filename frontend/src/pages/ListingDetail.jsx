import { useParams, Link } from 'react-router-dom';
import { getListings } from '../data/mockData';
import { Star, MapPin, Search, PlusCircle, CheckCircle, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ListingDetail() {
  const { id } = useParams();
  const allListings = getListings();
  const listing = allListings.find(l => l.id === id) || allListings[0];
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({ ...listing, price: listing.price_per_day_paise / 100 });
  };

  if (!listing) return <div className="flex-1 p-8 text-white">Listing not found</div>;

  return (
    <div className="flex-1 bg-surface pt-8 pb-32">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <div className="text-[10px] uppercase tracking-widest text-textMuted mb-6 flex gap-2">
           <Link to="/" className="hover:text-amber">Home</Link>
           <span>/</span>
           <Link to={`/catalog?category=${listing.category}`} className="hover:text-amber">{listing.category}</Link>
           <span>/</span>
           <span className="text-white truncate max-w-[200px]">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Main Content (Images + Desc) */}
          <div className="space-y-8">
             <div className="rounded-lg overflow-hidden border border-surfaceLight bg-background relative h-[450px]">
                <img src={listing.thumbnail} alt={listing.title} className="w-full h-full object-cover" />
                {listing.withDriver && (
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded text-xs font-bold text-white border border-surfaceLight flex items-center shadow-lg">
                    <Info size={14} className="mr-2 text-amber" /> COMES WITH DRIVER
                  </div>
                )}
             </div>
             
             <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(v => (
                  <div key={v} className="h-24 bg-background/50 border border-surfaceLight rounded overflow-hidden cursor-pointer hover:border-amber/50 transition-colors">
                     <img src={listing.thumbnail} className="w-full h-full object-cover opacity-60" />
                  </div>
                ))}
             </div>
             
             <div className="pt-8 border-t border-surfaceLight">
               <h3 className="text-xl font-bold text-white mb-4">Description</h3>
               <p className="text-textMuted leading-relaxed">{listing.description}</p>
               <p className="text-textMuted leading-relaxed mt-4">
                 Extended description placeholder. Highly reliable and properly maintained. Verified condition prior to every dispatch.
               </p>
             </div>
          </div>

          {/* Sidebar (Price, Owner, Action) */}
          <div className="space-y-6 lg:pl-8">
             <div>
               <h1 className="text-3xl font-bold text-white mb-3 leading-tight">{listing.title}</h1>
               <div className="flex items-center gap-4 text-sm mb-6">
                 <span className="text-amber flex items-center border border-amber/20 bg-amber/5 px-2 py-1 rounded">
                   <Star size={14} fill="currentColor" className="mr-1" /> 
                   <span className="font-semibold">{listing.rating}</span>
                   <span className="text-amber/60 ml-1">({listing.reviews})</span>
                 </span>
                 <span className="text-textMuted flex items-center">
                   <MapPin size={14} className="mr-1" /> {listing.location.address}
                 </span>
               </div>
             </div>
             
             {/* Prices Card */}
             <div className="card border-amber/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-full blur-3xl -z-10"></div>
                <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-surfaceLight">
                  <div>
                    <p className="text-textMuted text-[10px] uppercase tracking-wider mb-1">Daily</p>
                    <p className="text-2xl font-bold text-white">₹{(listing.price_per_day_paise / 100).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-textMuted text-[10px] uppercase tracking-wider mb-1">Weekly</p>
                    <p className="text-xl font-bold text-white/50">₹{(listing.price_per_week_paise / 100).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-textMuted text-[10px] uppercase tracking-wider mb-1">4 weeks</p>
                    <p className="text-xl font-bold text-white/50">₹{(listing.price_per_month_paise / 100).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                   <div className="flex items-center text-sm text-green-400">
                     <CheckCircle size={14} className="mr-2" /> Available today
                   </div>
                   <div className="flex items-center text-sm text-textMuted">
                     <Info size={14} className="mr-2 text-white/40" /> Refundable deposit: ₹{(listing.declared_value_paise / 100 * 0.25).toLocaleString()}
                   </div>
                </div>

                <button 
                  onClick={handleAdd}
                  className="btn-primary w-full py-4 text-sm tracking-wider shadow-lg shadow-amber/10"
                >
                  ADD TO CART
                </button>
             </div>

             {/* Owner Info */}
             <div className="card flex items-center justify-between group cursor-pointer hover:border-amber/30 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-background border border-surfaceLight rounded-full flex items-center justify-center overflow-hidden font-bold text-white">
                      {listing.owner.name.charAt(0)}
                   </div>
                   <div>
                      <p className="text-textMuted text-[10px] uppercase tracking-wider">Owner</p>
                      <p className="text-white font-semibold flex items-center">
                        {listing.owner.name}
                        {listing.owner.verified && (
                          <span className="ml-2 px-1.5 py-0.5 text-[8px] bg-green-500/10 text-green-500 border border-green-500/20 rounded uppercase">Verified</span>
                        )}
                      </p>
                   </div>
                </div>
                <div className="text-textMuted group-hover:text-white transition-colors text-sm">
                   View Profile →
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}
