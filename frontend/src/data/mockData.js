export const mockListings = [
  {
    id: 'l_01',
    title: 'Cushion Tire Forklift, 4000 lbs',
    category: 'construction',
    description: 'Perfect for warehouse operations. Comes with a driver.',
    declared_value_paise: 2500000, // ₹25,000 (Tier 3: > 15k RS)
    price_per_day_paise: 250000, // ₹2,500/day
    price_per_week_paise: 1500000,
    price_per_month_paise: 5000000,
    rating: 4.8,
    reviews: 12,
    location: { address: 'Mumbai, MH', lat: 19.0760, lng: 72.8777 },
    thumbnail: 'https://images.unsplash.com/photo-1541625602330-2277a4c4618c?w=800&auto=format&fit=crop&q=60',
    owner: { name: 'ZOZR', verified: true },
    withDriver: true
  },
  {
    id: 'l_02',
    title: 'DeWalt Power Drill',
    category: 'tools',
    description: 'Cordless 20V drill, excellent for minor fixes.',
    declared_value_paise: 80000, // ₹800 (Tier 1: < 1000 RS)
    price_per_day_paise: 15000, // ₹150/day 
    price_per_week_paise: 80000,
    price_per_month_paise: 250000,
    rating: 4.5,
    reviews: 8,
    location: { address: 'New Delhi, DL', lat: 28.6139, lng: 77.2090 },
    thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60',
    owner: { name: 'RentHub Direct', verified: true },
    withDriver: false
  },
  {
    id: 'l_03',
    title: 'Bosch High-Pressure Washer',
    category: 'garden',
    description: 'Electric washer for patios, cars and walkways.',
    declared_value_paise: 900000, // ₹9,000 (Tier 2: 2k-15k RS)
    price_per_day_paise: 40000, // ₹400
    price_per_week_paise: 200000,
    price_per_month_paise: 600000,
    rating: 4.9,
    reviews: 24,
    location: { address: 'Bangalore, KA', lat: 12.9716, lng: 77.5946 },
    thumbnail: 'https://images.unsplash.com/photo-1621644026362-e1d52dbe2c4a?w=800&auto=format&fit=crop&q=60',
    owner: { name: 'GreenScapes', verified: true },
    withDriver: false
  },
  {
    id: 'l_04',
    title: 'Electric Cement Mixer (5 Cu ft)',
    category: 'home repair',
    description: 'Portable electric mixer, perfect for small to medium concrete jobs around the house.',
    declared_value_paise: 3500000,
    price_per_day_paise: 6500, 
    price_per_week_paise: 22000,
    price_per_month_paise: 60000,
    rating: 4.6,
    reviews: 5,
    location: { address: 'Chennai, TN', lat: 13.0827, lng: 80.2707 },
    thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60',
    owner: { name: 'ToolBox Rentals', verified: false },
    withDriver: false
  },
  {
    id: 'l_05',
    title: 'Heavy Duty Pressure Washer (3200 PSI)',
    category: 'cleaning',
    description: 'Gas powered pressure washer for driveways, siding, and tough stains.',
    declared_value_paise: 4500000,
    price_per_day_paise: 5500, 
    price_per_week_paise: 20000,
    price_per_month_paise: 55000,
    rating: 4.7,
    reviews: 18,
    location: { address: 'Hyderabad, TS', lat: 17.3850, lng: 78.4867 },
    thumbnail: 'https://images.unsplash.com/photo-1621644026362-e1d52dbe2c4a?w=800&auto=format&fit=crop&q=60',
    owner: { name: 'CleanFreak Co', verified: true },
    withDriver: false
  }
];

export const categories = [
  { id: '1', name: 'Construction', icon: '🏗️', count: 1250 },
  { id: '2', name: 'Garden', icon: '🌿', count: 850 },
  { id: '3', name: 'Home Repair', icon: '🔨', count: 1540 },
  { id: '4', name: 'Plumbing', icon: '🚰', count: 420 },
  { id: '5', name: 'Electrical', icon: '⚡', count: 680 },
  { id: '6', name: 'Cleaning', icon: '🧼', count: 930 },
];

export const getListings = () => {
  const data = localStorage.getItem('renthub_listings_db');
  if (!data) {
    // Add `isBooked` flag to a couple items to demonstrate the "Unavailable" feature globally
    const seededListings = mockListings.map((l, i) => ({
      ...l,
      isBooked: i === 1 // Make the DeWalt Power Drill booked dynamically
    }));
    localStorage.setItem('renthub_listings_db', JSON.stringify(seededListings));
    return seededListings;
  }
  return JSON.parse(data);
};

export const saveListing = (listing) => {
  const data = getListings();
  data.push(listing);
  localStorage.setItem('renthub_listings_db', JSON.stringify(data));
};

export const removeListing = (id) => {
  const data = getListings();
  const filtered = data.filter(l => l.id !== id);
  localStorage.setItem('renthub_listings_db', JSON.stringify(filtered));
};
