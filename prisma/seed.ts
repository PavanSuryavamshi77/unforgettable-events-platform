import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Use the direct connection string for seed operations
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
})

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany({ where: { email: 'dummy@example.com' } });

  console.log("Seeding data...");

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create a dummy user
  const user = await prisma.user.create({
    data: {
      name: 'Dummy User',
      email: 'dummy@example.com',
      password: hashedPassword,
      role: 'USER',
    }
  });

  // Create an Admin user
  await prisma.user.deleteMany({ where: { email: 'admin@unforgettable.com' } });
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@unforgettable.com',
      password: hashedPassword,
      role: 'ADMIN',
    }
  });

  // Upcoming Events
  const event1 = await prisma.event.create({
    data: {
      title: "Grand Dandiya Night 2026",
      date: new Date("2026-10-10T13:00:00Z"),
      location: "Bangalore Cultural Ground",
      description: "Biggest Navratri celebration with live DJ, Garba dance and food stalls.",
      image: "/gallery/dandiya1.jpg",
      price: 599,
      type: "UPCOMING",
      schedule: [
        { time: "6:30 PM", activity: "Entry open" },
        { time: "7:00 PM", activity: "Opening ceremony" },
        { time: "7:30 PM", activity: "Dandiya dance" },
        { time: "9:00 PM", activity: "Competition" },
        { time: "10:30 PM", activity: "Closing" },
      ]
    }
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Navratri Garba Festival",
      date: new Date("2026-10-12T12:30:00Z"),
      location: "City Convention Hall",
      description: "Traditional Garba with live band and dance competition.",
      image: "/gallery/dandiya2.jpg",
      price: 799,
      type: "UPCOMING",
      schedule: [
        { time: "6:00 PM", activity: "Entry open" },
        { time: "7:00 PM", activity: "Aarti" },
        { time: "7:30 PM", activity: "Garba" },
        { time: "10:00 PM", activity: "Closing" },
      ]
    }
  });

  const event3 = await prisma.event.create({
    data: {
      title: "Dandiya Beats Night",
      date: new Date("2026-10-14T13:30:00Z"),
      location: "Open Air Stadium",
      description: "Dance all night with professional DJs and lighting show.",
      image: "/gallery/dandiya3.jpg",
      price: 999,
      type: "UPCOMING",
      schedule: [
        { time: "7:00 PM", activity: "Entry open" },
        { time: "8:00 PM", activity: "DJ Performance" },
        { time: "11:00 PM", activity: "Closing" },
      ]
    }
  });

  const event4 = await prisma.event.create({
    data: {
      title: "Neon Dandiya Disco",
      date: new Date("2026-10-15T14:00:00Z"),
      location: "Club Neon",
      description: "A modern twist to traditional Dandiya! Neon lights, glowing sticks, and EDM Garba mixes.",
      image: "/gallery/dandiya2.jpg",
      price: 1499,
      type: "UPCOMING",
      schedule: [
        { time: "8:00 PM", activity: "Doors Open" },
        { time: "9:00 PM", activity: "Neon Paint Distribution" },
        { time: "10:00 PM", activity: "DJ Drops the Beat" },
        { time: "1:00 AM", activity: "Event Ends" },
      ]
    }
  });

  // Past Events
  const pastEvent1 = await prisma.event.create({
    data: {
      title: "Concerts 2025",
      date: new Date("2025-10-05T12:30:00Z"),
      location: "Community Hall",
      description: "A spectacular classical music and dance concert that saw over 500 attendees.",
      image: "/gallery/past1.jpg",
      price: 499,
      type: "PAST",
      schedule: [
        { time: "5:00 PM", activity: "Meet and Greet" },
        { time: "6:00 PM", activity: "Main Performance" },
        { time: "8:30 PM", activity: "Dinner" },
      ]
    }
  });

  const pastEvent2 = await prisma.event.create({
    data: {
      title: "Holi Celebration 2024",
      date: new Date("2024-10-08T04:30:00Z"),
      location: "City Center Ground",
      description: "Massive Holi festival with organic colors, rain dance, and food trucks.",
      image: "/gallery/past2.jpg",
      price: 299,
      type: "PAST",
      schedule: [
        { time: "10:00 AM", activity: "Color Splash" },
        { time: "12:00 PM", activity: "Rain Dance" },
        { time: "2:00 PM", activity: "Lunch & Wrap Up" },
      ]
    }
  });

  const pastEvent3 = await prisma.event.create({
    data: {
      title: "Mega Garba Fest 2023",
      date: new Date("2023-10-10T13:30:00Z"),
      location: "Festival Arena",
      description: "Our largest Navratri celebration to date with 2000+ dancers.",
      image: "/gallery/past3.jpg",
      price: 899,
      type: "PAST",
      schedule: [
        { time: "6:00 PM", activity: "Maha Aarti" },
        { time: "7:00 PM", activity: "Garba Rounds" },
        { time: "11:00 PM", activity: "Prizes Distribution" },
      ]
    }
  });

  // Create Dummy Bookings
  await prisma.booking.create({
    data: {
      userId: user.id,
      eventId: event1.id,
      ticketId: "TKT-DUMMY123",
      qrCode: "dummy-qr-code-data",
    }
  });

  await prisma.booking.create({
    data: {
      userId: user.id,
      eventId: event4.id,
      ticketId: "TKT-DUMMY456",
      qrCode: "dummy-qr-code-data",
    }
  });
  
  await prisma.booking.create({
    data: {
      userId: user.id,
      eventId: pastEvent1.id,
      ticketId: "TKT-PAST789",
      qrCode: "dummy-qr-code-data",
    }
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
