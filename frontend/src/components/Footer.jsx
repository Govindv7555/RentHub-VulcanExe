import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function Footer() {
  const [showTermsModal, setShowTermsModal] = useState(false);
  return (
    <footer className="bg-background pt-20 pb-10 border-t border-surfaceLight mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-bold tracking-tight mb-4 inline-block">
            <span className="text-white">RENT</span><span className="text-amber">HUB</span>
          </Link>
          <p className="text-sm text-textMuted leading-relaxed max-w-xs">
            The platform for renting everything from heavy construction machinery to household tools and garden equipment.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Categories</h4>
          <ul className="space-y-3">
            {['Construction', 'Garden', 'Home Repair', 'Plumbing', 'Cleaning'].map((item) => (
              <li key={item}>
                <Link to={`/catalog?category=${item.toLowerCase()}`} className="text-textMuted hover:text-amber transition-colors text-sm">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Company</h4>
          <ul className="space-y-3">
            {['About Us', 'Contact', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
              <li key={item}>
                {item === 'Terms & Conditions' ? (
                  <button onClick={() => setShowTermsModal(true)} className="text-textMuted hover:text-amber transition-colors text-sm">
                    {item}
                  </button>
                ) : (
                  <button className="text-textMuted hover:text-amber transition-colors text-sm">
                    {item}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Subscribe</h4>
          <p className="text-sm text-textMuted mb-4">Get updates on new equipment and offers.</p>
          <div className="flex border border-surfaceLight rounded overflow-hidden">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent px-4 py-2 w-full text-sm text-white focus:outline-none"
            />
            <button className="bg-amber text-background px-4 font-semibold text-sm hover:bg-amberHover transition-colors">
              →
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-surfaceLight/30 flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs text-textMuted flex items-center">
          © {new Date().getFullYear()} RentHub. All rights reserved. <span className="mx-2">|</span> 
          <span className="text-amber/70 font-medium">DEMO ENVIRONMENT</span>
        </p>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-background border border-surfaceLight rounded-lg max-w-2xl w-full p-6 md:p-8 animate-fade-in-up relative">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-textMuted hover:text-white transition-colors"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-sm text-white/80 leading-relaxed font-normal overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <h3 className="text-amber font-semibold uppercase tracking-wider text-xs">Delivery Inspection and Damage</h3>
              <p>At the time of delivery, the customer must inspect the rented product in the presence of the RentHub delivery partner and verify its condition, functionality, accessories, and any visible damage before accepting the delivery.</p>
              <p>The customer may report any issue immediately to the delivery partner before confirming receipt. Once the customer completes the inspection, confirms acceptance, and provides the required delivery PIN/OTP, the product will be considered accepted in the condition observed at the time of delivery.</p>
              <p>After the delivery is completed and the delivery partner leaves, the customer is responsible for the product throughout the rental period. Any damage, loss, missing accessories, or misuse occurring after acceptance may be the customer's responsibility, subject to the applicable rental agreement, documented pre-existing defects, normal wear and tear, and applicable law.</p>
              <p className="text-amber/90 font-medium bg-amber/10 p-3 border-l-2 border-amber">Customers are strongly advised to take photographs or videos of the product at the time of delivery for their records.</p>
            </div>
            <div className="mt-8 pt-6 border-t border-surfaceLight flex justify-end">
               <button onClick={() => setShowTermsModal(false)} className="btn-primary px-8">Acknowledge</button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
