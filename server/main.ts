import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import staticFiles from '@fastify/static';
import { resolve } from 'path';
import { DatabaseService } from './services/database-service.ts';
import { ImageService } from './services/image-service.ts';
import { PhotosService } from './photos/photos-service.ts';
import { AlbumsService } from './albums/albums-service.ts';
import { photosRoutes } from './photos/photos-routes.ts';
import { albumsRoutes } from './albums/albums-routes.ts';


// Start server
const start = async () => {
  const fastify = Fastify({
    logger: true
  });
  
  // Register multipart for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024 // 50MB
    }
  });
  
  // Serve static images
  await fastify.register(staticFiles, {
    root: resolve(process.cwd(), 'data', 'images'),
    prefix: '/images/'
  });
  
  // Initialize services
  const databaseService = new DatabaseService();
  await databaseService.initialize();
  
  const imageService = new ImageService();
  const photosService = new PhotosService(databaseService, imageService);
  const albumsService = new AlbumsService(databaseService);
  
  // Register routes
  await photosRoutes(fastify, photosService);
  await albumsRoutes(fastify, albumsService);
  
  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  try {
    await fastify.listen({ port: 5799, host: '0.0.0.0' });
    console.log('🚀 Server running at http://localhost:5799');
    console.log('📁 Images served at http://localhost:5799/images/');
    console.log('🏥 Health check at http://localhost:5799/health');
    console.log(`📂 Data directory: ${resolve(process.cwd(), 'data')}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 