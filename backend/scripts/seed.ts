import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load .env.local manually for the script
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envData = fs.readFileSync(envPath, "utf8");
  envData.split("\n").forEach((line) => {
    if (line.trim() && !line.startsWith("#")) {
      const [key, ...vals] = line.split("=");
      process.env[key.trim()] = vals.join("=").trim();
    }
  });
}

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const listingsData = [
  {
    title: "Heavy Duty Hammer Drill",
    description: "Bosch Professional hammer drill, great for concrete and masonry.",
    category: "construction",
    declared_value_paise: 1500000,
    price_per_day_paise: 50000,
    photos: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600"],
    lat: 12.9716, lng: 77.5946, address: "MG Road, Bengaluru",
  },
  {
    title: "Makita Angle Grinder",
    description: "High speed angle grinder for metal and stone cutting.",
    category: "construction",
    declared_value_paise: 800000,
    price_per_day_paise: 30000,
    photos: ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=600"],
    lat: 12.9279, lng: 77.6271, address: "Koramangala, Bengaluru",
  },
  {
    title: "Electric Lawnmower",
    description: "Quiet and efficient electric lawnmower for medium-sized gardens.",
    category: "garden",
    declared_value_paise: 2500000,
    price_per_day_paise: 80000,
    photos: ["https://images.unsplash.com/photo-1592424001809-54876b669f6f?auto=format&fit=crop&q=80&w=600"],
    lat: 13.0285, lng: 77.5895, address: "Malleswaram, Bengaluru",
  },
  {
    title: "High Pressure Washer",
    description: "Karcher high pressure washer for deep cleaning patios and cars.",
    category: "cleaning",
    declared_value_paise: 1200000,
    price_per_day_paise: 40000,
    photos: ["https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=600"],
    lat: 12.9308, lng: 77.5838, address: "Jayanagar, Bengaluru",
  },
  {
    title: "Professional Carpet Cleaner",
    description: "Industrial grade carpet cleaner with upholstery attachments.",
    category: "cleaning",
    declared_value_paise: 3000000,
    price_per_day_paise: 100000,
    photos: ["https://images.unsplash.com/photo-1527515637-640a3f81e815?auto=format&fit=crop&q=80&w=600"],
    lat: 12.9784, lng: 77.6408, address: "Indiranagar, Bengaluru",
  },
  {
    title: "Pipe Wrench Set",
    description: "Heavy duty pipe wrench set for plumbing work. Sizes 10 to 18 inches.",
    category: "plumbing",
    declared_value_paise: 500000,
    price_per_day_paise: 15000,
    photos: ["https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=600"],
    lat: 12.9105, lng: 77.5993, address: "BTM Layout, Bengaluru",
  },
  {
    title: "Tile Cutter",
    description: "Professional manual tile cutter, can cut up to 600mm tiles.",
    category: "home_repair",
    declared_value_paise: 600000,
    price_per_day_paise: 25000,
    photos: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600"],
    lat: 12.9854, lng: 77.5332, address: "Rajajinagar, Bengaluru",
  },
  {
    title: "Multimeter & Wire Stripper",
    description: "Digital multimeter and professional wire stripping tools.",
    category: "electrical",
    declared_value_paise: 300000,
    price_per_day_paise: 10000,
    photos: ["https://images.unsplash.com/photo-1590845947376-2638caa89309?auto=format&fit=crop&q=80&w=600"],
    lat: 13.0068, lng: 77.5813, address: "Sadashivanagar, Bengaluru",
  },
  {
    title: "Leaf Blower",
    description: "Battery powered leaf blower for clearing garden debris fast.",
    category: "garden",
    declared_value_paise: 900000,
    price_per_day_paise: 35000,
    photos: ["https://images.unsplash.com/photo-1605389658532-698d28e7e31b?auto=format&fit=crop&q=80&w=600"],
    lat: 12.9345, lng: 77.6200, address: "HSR Layout, Bengaluru",
  },
  {
    title: "Wet & Dry Vacuum Cleaner",
    description: "Large capacity wet and dry vac for heavy duty cleanup.",
    category: "cleaning",
    declared_value_paise: 1000000,
    price_per_day_paise: 45000,
    photos: ["https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=600"],
    lat: 12.9591, lng: 77.6468, address: "Domlur, Bengaluru",
  }
];

async function seed() {
  console.log("Starting DB seed...");

  const createdUserIds = [];

  for (let i = 1; i <= 3; i++) {
    const phone = `+91999900000${i}`;
    console.log(`Creating user ${phone}...`);
    
    // Check if exists
    const { data: existing } = await supabaseAdmin.from("users").select("id").eq("phone_masked", phone.slice(-4)).limit(1);
    let userId;

    if (existing && existing.length > 0) {
      userId = existing[0].id;
      console.log(`User already exists, ID: ${userId}`);
    } else {
      // Create auth user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        phone,
        phone_confirm: true,
        password: `mock_password_${phone}`,
      });

      if (authError || !authUser.user) {
        console.error(`Failed to create auth user ${phone}:`, authError);
        continue;
      }
      userId = authUser.user.id;

      // Create profile
      await supabaseAdmin.from("users").insert({
        id: userId,
        phone_masked: phone.slice(-4),
        name: `Demo User ${i}`,
        kyc_verified: true,
        rating_avg: 4.5,
        rating_count: 10,
      });

      // Create identity record
      await supabaseAdmin.from("identity_records").insert({
        user_id: userId,
        name: `Demo User ${i}`,
        dob: "1990-01-01",
        gender: "M",
        address_hash: "seed_mock_address",
        aadhaar_last4: `000${i}`,
        verified_badge: true,
      });

      console.log(`Created new user, ID: ${userId}`);
    }
    
    createdUserIds.push(userId);
  }

  if (createdUserIds.length === 0) {
    console.log("No users created, aborting listings seed.");
    return;
  }

  console.log(`Seeding ${listingsData.length} listings...`);
  
  for (let i = 0; i < listingsData.length; i++) {
    const listing = listingsData[i];
    // Round robin assign to users
    const ownerId = createdUserIds[i % createdUserIds.length];
    
    const { error } = await supabaseAdmin.from("listings").insert({
      owner_id: ownerId,
      ...listing,
      status: "active",
    });

    if (error) {
      console.error(`Failed to insert listing ${listing.title}:`, error);
    } else {
      console.log(`Inserted listing: ${listing.title}`);
    }
  }

  console.log("Seed completed successfully.");
}

seed().catch(console.error);
