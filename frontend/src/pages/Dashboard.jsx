import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Package, MessageCircle, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { getListings, removeListing } from '../data/mockData';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    if (user) {
      setMyListings(getListings().filter(item => item.owner_id === user.id));
    }
  }, [user]);

  const getTrustPercentage = () => {
    if (!user || (user.transactions_count || 0) < 5) return 0;
    return (user.rating_avg / 5) * 100;
  };
  
  const trustScore = getTrustPercentage(); 
  const profileComplete = 100;
  const idVerification = user?.kyc_verified ? 100 : 80; 
  const reviewsScore = user?.transactions_count > 0 ? (user.rating_avg / 5) * 100 : 0; 

  if (!user) {
     return (
       <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
         <h2 className="text-2xl font-bold text-white mb-4">You are not logged in</h2>
         <Link to="/login" className="btn-primary">Go to Login</Link>
       </div>
     );
  }

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this listing?")) {
      removeListing(id);
      setMyListings(getListings().filter(item => item.owner_id === user.id));
    }
  };

  const myRentals = []; // Empty state for active rentals

  return (
    <div className="flex-1 bg-surface pt-12 pb-32">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name}</h1>
            <p className="text-textMuted flex items-center">
              Trust Score: <span className="ml-2 font-bold text-amber">{trustScore}%</span>
            </p>
          </div>
          <Link to="/create-listing" className="btn-primary flex items-center shadow-lg shadow-amber/20">
            <Plus size={18} className="mr-2" /> List an Item
          </Link>
        </div>

        {/* Custom Tabs */}
        <div className="flex space-x-8 border-b border-surfaceLight mb-8">
          {[
            { id: 'profile', label: 'Profile & Trust' },
            { id: 'listings', label: 'My Listings' },
            { id: 'rentals', label: 'My Rentals' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-4 text-sm font-semibold transition-colors border-b-2 relative -bottom-[1px]",
                activeTab === tab.id 
                  ? "text-amber border-amber" 
                  : "text-textMuted border-transparent hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          
          {/* PROFILE & TRUST ENGINE */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
              
              {/* Trust Overview */}
              <div className="card lg:col-span-1 border-amber/30 bg-amber/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber/10 rounded-full blur-3xl"></div>
                <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm flex items-center">
                  <ShieldCheck size={18} className="mr-2 text-amber" /> Trust Engine
                </h3>
                
                {/* Circular Metric Mockup */}
                <div className="flex justify-center mb-8">
                  <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-[8px] border-surfaceLight">
                    {/* SVG partial circle hack for demo */}
                    <div className="absolute inset-0 rounded-full border-[8px] border-amber" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 75%)' }}></div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white block">{trustScore}%</span>
                      <span className="text-[10px] text-textMuted uppercase tracking-wider">Trusted</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-textMuted px-4 leading-relaxed">
                  Your Trust Score is visible to others and determines your ability to rent high-value items without deposits.
                </p>
              </div>

              {/* Trust Details Breakdown */}
              <div className="card lg:col-span-2">
                <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Trust Breakdown</h3>
                
                <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-sm mb-2">
                       <span className="text-white">Profile Details</span>
                       <span className="text-amber hidden md:inline">Complete ({profileComplete}%)</span>
                     </div>
                     <div className="h-2 bg-surfaceLight rounded-full overflow-hidden">
                       <div className="h-full bg-amber" style={{width: `${profileComplete}%`}}></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm mb-2">
                       <span className="text-white">Identity Verification (Aadhaar / Passport)</span>
                       <span className="text-white/50 hidden md:inline">{idVerification}%</span>
                     </div>
                     <div className="h-2 bg-surfaceLight rounded-full overflow-hidden">
                       <div className="h-full bg-amber" style={{width: `${idVerification}%`}}></div>
                     </div>
                     <div className="mt-3">
                       {!user.kyc_verified ? (
                         <button className="text-xs uppercase tracking-wider font-bold text-amber hover:text-amberHover transition-colors border border-amber/30 px-3 py-1 rounded">Verify Now</button>
                       ) : (
                         <span className="text-xs text-green-500 font-semibold flex items-center"><ShieldCheck size={12} className="mr-1" /> Verified</span>
                       )}
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm mb-2">
                       <span className="text-white">Reviews & Ratings</span>
                       <span className="text-white/50 hidden md:inline">{reviewsScore}%</span>
                     </div>
                     <div className="h-2 bg-surfaceLight rounded-full overflow-hidden">
                       <div className="h-full bg-surfaceLight" style={{width: `${reviewsScore}%`, backgroundColor: '#A0A0A0'}}></div>
                     </div>
                     <p className="text-xs text-textMuted mt-1">Complete more rentals to boost this.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* MY LISTINGS (Inventory Management) */}
          {activeTab === 'listings' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center">
                  <Package size={18} className="mr-2" /> Active Listings
                </h3>
              </div>
              
              {myListings.length === 0 ? (
                <div className="card py-16 text-center border-dashed">
                  <p className="text-textMuted mb-4">You have not listed any items yet.</p>
                  <Link to="/create-listing" className="btn-outline text-xs">Create First Listing</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myListings.map(item => (
                    <div key={item.id} className={cn("card p-4 flex gap-4 transition-all relative overflow-hidden", item.isBooked && "grayscale opacity-60 pointer-events-none")}>
                      {item.isBooked && (
                        <div className="absolute top-4 right-4 z-10 bg-black/80 px-2 py-1 rounded text-[10px] uppercase font-bold text-white border border-surfaceLight">
                          Already Booked
                        </div>
                      )}
                      <div className="w-24 h-24 bg-background border border-surfaceLight rounded shrink-0 overflow-hidden">
                        <img src={item.thumbnail} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                           <div className="flex justify-between items-start">
                             <h4 className="font-bold text-white text-sm line-clamp-1 flex-1 pr-2">{item.title}</h4>
                             {!item.isBooked && <span className="text-[10px] uppercase font-bold text-green-500 border border-green-500/20 bg-green-500/10 px-2 py-0.5 rounded">Active</span>}
                           </div>
                           <p className="text-[10px] text-textMuted flex items-center mt-1">
                             <MapPin size={10} className="mr-1" /> {item.location.address}
                           </p>
                        </div>
                        <div className="flex justify-between items-end">
                           <div className="flex gap-4">
                             <div>
                               <p className="text-[10px] text-textMuted uppercase mb-0.5">Daily</p>
                               <p className="text-sm font-semibold text-white">₹{(item.price_per_day_paise / 100).toLocaleString()}</p>
                             </div>
                           </div>
                           <button onClick={() => handleDelete(item.id)} className="text-[10px] uppercase tracking-wider font-semibold text-red-500 hover:text-white transition-colors">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MY RENTALS (Past and Active Bookings) */}
          {activeTab === 'rentals' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center">
                  <ShieldCheck size={18} className="mr-2" /> Booking History
                </h3>
              </div>
              
              {myRentals.length === 0 ? (
                <div className="card py-16 text-center border-dashed">
                  <p className="text-textMuted mb-4">You have no active or past rentals.</p>
                  <Link to="/catalog" className="btn-outline text-xs">Browse Gear</Link>
                </div>
              ) : (
                <div>{/* Map rentals here */}</div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
