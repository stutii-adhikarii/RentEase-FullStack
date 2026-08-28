require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Apartment = require("../models/apartment");

const SAMPLE_DESCRIPTION =
  "A bright, well-kept home with room to live and work. Close to shops, transit, and parks, with an easy layout for everyday life.";

const listings = [
  {
    title: "The Grand View Loft",
    address: "1204 Skyline Blvd, Downtown",
    neighborhood: "Downtown",
    price: 2450,
    bedrooms: 2,
    bathrooms: 2.5,
    sqft: 1100,
    type: "loft",
    isFeatured: true,
    tags: ["New Listing"],
    amenities: ["Fast WiFi", "Air Conditioning", "Full Kitchen", "Gym"],
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1554995207-c8b60f5825ed?w=1200&q=80",
    ],
  },
  {
    title: "Oasis Studio",
    address: "88 Pine Lane, North Hills",
    neighborhood: "North Hills",
    price: 1650,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 520,
    type: "studio",
    isFeatured: true,
    tags: ["Pet Friendly"],
    amenities: ["Air Conditioning", "Pet Friendly", "Parking"],
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    ],
  },
  {
    title: "Maple Townhomes",
    address: "400 River Walk, East End",
    neighborhood: "East End",
    price: 2890,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1450,
    type: "townhome",
    isFeatured: true,
    amenities: ["Parking", "In-unit Laundry", "Pet Friendly", "Balcony"],
    photos: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "landlord@rentease.test";
  const password = "secret123";
  let landlord = await User.findOne({ email });
  if (!landlord) {
    landlord = await User.create({
      fullName: "Sarah Jenkins",
      email,
      phone: "+1 (555) 123-4567",
      password: await bcrypt.hash(password, 10),
      role: "landlord",
    });
  }

  const existing = await Apartment.countDocuments({ landlord: landlord._id });
  if (existing === 0) {
    await Apartment.insertMany(
      listings.map((item) => ({
        ...item,
        description: SAMPLE_DESCRIPTION,
        status: "available",
        landlord: landlord._id,
      })),
    );
  }

  const total = await Apartment.countDocuments();
  console.log(`Seed complete. Landlord login: ${email} / ${password}`);
  console.log(`Apartments in database: ${total}`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
