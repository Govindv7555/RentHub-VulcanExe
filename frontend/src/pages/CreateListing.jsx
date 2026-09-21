import { useState } from 'react';
import { Camera, MapPin, CheckCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const steps = ['Category', 'Details & Pricing', 'Location', 'Terms'];

export default function CreateListing() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(s => s + 1);
    } else {
      alert("Listing successfully created and is pushed to your Gear Dashboard.");
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex-1 bg-background pt-8 pb-32">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">List your item</h1>
          <p className="text-textMuted text-sm">Monetize your unused tools and equipment securely.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-surfaceLight -z-10 -translate-y-1/2"></div>
          {steps.map((label, idx) => (
            <div key={label} className="bg-background px-2 flex flex-col items-center">
               <div className={cn(
                 "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-background mb-2 transition-colors",
                 currentStep === idx ? "bg-amber text-black" : 
                 currentStep > idx ? "bg-amber/50 text-white" : "bg-surface text-textMuted border border-surfaceLight"
               )}>
                 {currentStep > idx ? <CheckCircle size={16} /> : (idx + 1)}
               </div>
               <span className={cn(
                 "text-[10px] uppercase font-semibold",
                 currentStep === idx ? "text-amber" : "text-textMuted"
               )}>{label}</span>
            </div>
          ))}
        </div>

        <div className="card p-6 md:p-10 border-surfaceLight/50">
          
          {/* Step 1: Category & Photos */}
          {currentStep === 0 && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Upload Photos</label>
                <div className="border-2 border-dashed border-surfaceLight hover:border-amber/50 transition-colors rounded-lg bg-surface/50 h-48 flex flex-col items-center justify-center cursor-pointer">
                  <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-3">
                    <Camera size={20} className="text-textMuted" />
                  </div>
                  <p className="font-semibold text-white text-sm">Drag and drop images here</p>
                  <p className="text-xs text-textMuted mt-1">Make sure you show any wear & tear</p>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-3 block">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Construction', 'Garden', 'Home Repair', 'Plumbing', 'Electrical', 'Cleaning'].map((cat, i) => (
                    <button key={cat} className={cn(
                      "py-3 px-4 border rounded text-sm font-semibold transition-colors text-center",
                      i === 0 ? "border-amber bg-amber/10 text-amber" : "border-surfaceLight text-textMuted hover:text-white"
                    )}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details & Pricing */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Listing Title</label>
                <input type="text" className="input-field w-full" placeholder="e.g. Bosch Professional Rotary Hammer Drill" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Item Description</label>
                <textarea rows={4} className="input-field w-full resize-none" placeholder="Provide full details, condition, and included accessories..."></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-surfaceLight">
                <div>
                  <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Daily Rate (₹)</label>
                  <input type="number" className="input-field w-full" placeholder="0.00" defaultValue="45" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Hourly Rate (₹) - Optional</label>
                  <input type="number" className="input-field w-full" placeholder="0.00" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block flex items-center">
                  Declared Value <Info size={12} className="ml-1 opacity-50" />
                </label>
                <input type="number" className="input-field w-full" placeholder="Replacement value for insurance" defaultValue="500" />
                <p className="text-[10px] text-amber mt-2">RentHub uses this to calculate the renter's deposit and insurance premium.</p>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Item Location</label>
                <div className="relative">
                  <input type="text" className="input-field w-full pl-10" placeholder="Enter street address or zip code" defaultValue="Mumbai, MH 400001" />
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block flex items-center">
                   Interactive Map Pin (Mock)
                </label>
                <div className="w-full h-64 bg-surface rounded-lg border border-surfaceLight flex flex-col items-center justify-center relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=60')] bg-cover bg-center">
                   <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
                   
                   {/* Fake Map Elements */}
                   <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0 opacity-10">
                      {Array(16).fill(0).map((_, i) => <div key={i} className="border border-white/20"></div>)}
                   </div>
                   
                   <div className="z-10 flex flex-col items-center cursor-pointer transform hover:-translate-y-1 transition-transform">
                      <MapPin size={40} className="text-amber drop-shadow-lg" />
                      <div className="w-4 h-1 bg-black/50 blur-sm rounded-full mt-2"></div>
                   </div>
                   
                   <div className="absolute bottom-4 right-4 bg-background border border-surfaceLight px-3 py-1 rounded shadow-lg text-[10px] font-mono text-textMuted">
                     LAT 19.0760 / LNG 72.8777
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Terms */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-xl font-bold text-white mb-4">Set Rental Terms</h3>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Custom Rules or Constraints</label>
                <textarea rows={4} className="input-field w-full resize-none" placeholder="e.g. Return completely clean, fuel tank full, must present valid ID upon pickup..."></textarea>
              </div>

              <div className="bg-amber/10 border border-amber/30 rounded p-4 flex gap-4">
                 <ShieldCheck size={24} className="text-amber shrink-0" />
                 <div>
                    <h4 className="font-bold text-white text-sm mb-1">Standard Trust Guarantees Apply</h4>
                    <p className="text-xs text-textMuted leading-relaxed">
                      By listing this item, RentHub will strictly enforce Aadhaar face-matching (KYC) on renters, automatically collect security deposits in escrow, and generate a legally-binding valid eSign contract between you and the renter upon every transaction.
                    </p>
                 </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-10 pt-6 border-t border-surfaceLight">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className={cn("btn-outline", currentStep === 0 && "opacity-0 pointer-events-none")}
            >
              Back
            </button>
            <button onClick={handleNext} className="btn-primary px-10">
              {currentStep === steps.length - 1 ? 'Publish Listing' : 'Next Step'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
