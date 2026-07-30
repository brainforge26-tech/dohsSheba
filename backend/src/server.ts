import 'dotenv/config';
import http from 'http';
import app from './app';
import { prisma } from './lib/prisma';
import { initSocket } from './lib/socket';

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📄 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

