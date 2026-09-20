import { Link } from 'react-router-dom';

export default function Footer() {
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
                <button className="text-textMuted hover:text-amber transition-colors text-sm">
                  {item}
                </button>
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
    </footer>
  );
}
