require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./models/Expert');
const seedExperts = [
  {
    name: "Dr. Aristhotene",
    category: "Technology",
    experience: 10,
    rating: 4.8,
    description: "Cloud Architecture specialist with 10 years of AWS and DevOps experience.",
    slots: [
      { date: "2026-02-21", time: "10:00 AM", isBooked: false },
      { date: "2026-02-21", time: "11:00 AM", isBooked: false },
      { date: "2026-02-22", time: "02:00 PM", isBooked: false }
    ]
  },
  {
    name: "Sarah Jenkins",
    category: "Management",
    experience: 8,
    rating: 4.9,
    description: "Agile Coach and Project Manager. Helped 50+ startups scale their operations.",
    slots: [
      { date: "2026-02-21", time: "09:00 AM", isBooked: false },
      { date: "2026-02-21", time: "01:00 PM", isBooked: false }
    ]
  },
  {
    name: "Marcus Chen",
    category: "Technology",
    experience: 6,
    rating: 4.7,
    description: "Full Stack Developer specializing in React, Node.js, and System Design.",
    slots: [
      { date: "2026-02-23", time: "10:00 AM", isBooked: false },
      { date: "2026-02-23", time: "12:00 PM", isBooked: false }
    ]
  },
  {
    name: "Elena Rodriguez",
    category: "Marketing",
    experience: 12,
    rating: 5.0,
    description: "Digital Marketing strategist focused on SEO, SEM, and Brand Growth.",
    slots: [
      { date: "2026-02-22", time: "11:00 AM", isBooked: false },
      { date: "2026-02-24", time: "03:00 PM", isBooked: false }
    ]
  },
  {
    name: "James Wilson",
    category: "Finance",
    experience: 15,
    rating: 4.6,
    description: "Certified Financial Planner. Expert in Investment Banking and Personal Finance.",
    slots: [
      { date: "2026-02-21", time: "04:00 PM", isBooked: false },
      { date: "2026-02-25", time: "10:00 AM", isBooked: false }
    ]
  },
  {
    name: "Priya Sharma",
    category: "Design",
    experience: 5,
    rating: 4.9,
    description: "Senior UI/UX Designer. Expert in Figma, Prototyping, and Design Systems.",
    slots: [
      { date: "2026-02-21", time: "02:00 PM", isBooked: false },
      { date: "2026-02-22", time: "10:00 AM", isBooked: false }
    ]
  },
  {
    name: "Kevin Durant",
    category: "Management",
    experience: 20,
    rating: 4.5,
    description: "Executive Leadership Coach with focus on Corporate Strategy and HR.",
    slots: [
      { date: "2026-02-23", time: "09:00 AM", isBooked: false },
      { date: "2026-02-23", time: "11:00 AM", isBooked: false }
    ]
  }
];

// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     await Expert.deleteMany({});
//     await Expert.insertMany(seedExperts);
//     console.log("Data Seeded!");
//     process.exit();
//   });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Expert.deleteMany({});
    console.log("Old data cleared.");

    await Expert.insertMany(seedExperts);
    console.log(`${seedExperts.length} Experts seeded successfully!`);

    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();