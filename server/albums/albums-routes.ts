import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { AlbumsService } from './albums-service';
import { createAlbumSchema, albumParamsSchema } from './albums-interfaces';

export async function albumsRoutes(fastify: FastifyInstance, albumsService: AlbumsService) {
  // GET /albums
  fastify.get('/albums', async (request, reply) => {
    try {
      const albums = await albumsService.getAllAlbums();
      reply.send(albums);
    } catch (error) {
      console.error('Error getting albums:', error);
      reply.status(500).send({ error: 'Failed to get albums' });
    }
  });

  // GET /albums/:id
  fastify.get('/albums/:id', async (request, reply) => {
    try {
      const paramsResult = albumParamsSchema.safeParse(request.params);
      
      if (!paramsResult.success) {
        reply.status(400).send({ 
          error: 'Invalid album ID', 
          details: paramsResult.error.errors 
        });
        return;
      }

      const { id } = paramsResult.data;
      const album = await albumsService.getAlbumById(id);
      
      if (!album) {
        reply.status(404).send({ error: 'Album not found' });
        return;
      }
      
      reply.send(album);
    } catch (error) {
      console.error('Error getting album:', error);
      reply.status(500).send({ error: 'Failed to get album' });
    }
  });

  // POST /albums
  fastify.post('/albums', async (request, reply) => {
    try {
      const bodyResult = createAlbumSchema.safeParse(request.body);
      
      if (!bodyResult.success) {
        reply.status(400).send({ 
          error: 'Invalid request data', 
          details: bodyResult.error.errors 
        });
        return;
      }

      const album = await albumsService.createAlbum(bodyResult.data);
      reply.status(201).send(album);
    } catch (error) {
      console.error('Error creating album:', error);
      
      if (error instanceof ZodError) {
        reply.status(400).send({ 
          error: 'Validation error', 
          details: error.errors 
        });
        return;
      }
      
      reply.status(500).send({ error: 'Failed to create album' });
    }
  });

  // DELETE /albums/:id
  fastify.delete('/albums/:id', async (request, reply) => {
    try {
      const paramsResult = albumParamsSchema.safeParse(request.params);
      
      if (!paramsResult.success) {
        reply.status(400).send({ 
          error: 'Invalid album ID', 
          details: paramsResult.error.errors 
        });
        return;
      }

      const { id } = paramsResult.data;
      const deleted = await albumsService.deleteAlbum(id);
      
      if (!deleted) {
        reply.status(404).send({ error: 'Album not found' });
        return;
      }

      reply.status(204).send();
    } catch (error) {
      console.error('Error deleting album:', error);
      reply.status(500).send({ error: 'Failed to delete album' });
    }
  });
} 