import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const john = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      role: 'USER',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@postal.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const deliveryPerson = await prisma.user.create({
    data: {
      email: 'driver@postal.com',
      name: 'Delivery Driver',
      role: 'DELIVERY_PERSON',
    },
  });

  console.log('Created users:', { john, adminUser, deliveryPerson });

  // Create addresses
  const senderAddress = await prisma.address.create({
    data: {
      street: '123 Sender St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
  });

  const recipientAddress = await prisma.address.create({
    data: {
      street: '456 Recipient Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
    },
  });

  console.log('Created addresses:', { senderAddress, recipientAddress });

  // Create a package
  const package1 = await prisma.package.create({
    data: {
      trackingNumber: 'TRK12345678',
      weight: 2.5,
      description: 'Electronics - Handle with care',
      senderId: john.id,
      fromAddressId: senderAddress.id,
      toAddressId: recipientAddress.id,
      status: 'IN_TRANSIT',
      events: {
        create: [
          {
            status: 'PENDING',
            description: 'Package registered',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          },
          {
            status: 'PICKED_UP',
            location: 'New York Sorting Facility',
            description: 'Package picked up by courier',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
          {
            status: 'IN_TRANSIT',
            location: 'Chicago Distribution Center',
            description: 'Package in transit to destination',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          },
        ],
      },
    },
  });

  console.log('Created package:', package1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 