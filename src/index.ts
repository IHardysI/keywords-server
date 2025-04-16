import { Elysia } from "elysia";
import { connectToDb } from "./db";
import cors from '@elysiajs/cors';
import { createUserController } from "./controllers/UserController";

const db = await connectToDb();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers'],
    maxAge: 86400,
    credentials: true,
  }))
  .get('/', () => 'Hello Elysia')
  .use(createUserController(db))
  .listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

