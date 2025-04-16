import { Elysia, t } from "elysia";
import { Db } from "mongodb";
import { UserService } from "../services/UserService";

export function createUserController(db: Db) {
  const userService = new UserService(db);

  return new Elysia({ prefix: '/users', detail: { tags: ['users'] } })
    // Sign-up endpoint
    .post("/sign-up", async ({ body }) => {
      const { email, password } = body;
      const user = await userService.findByEmail(email);
      
      if (user) {
        return { error: 'User already exists' };
      }
      
      return await userService.createUser({
        email,
        password,
        firstName: body.firstName || '',
        lastName: body.lastName || ''
      });
    }, {
      body: t.Object({
        email: t.String({ description: "User's email address" }),
        password: t.String({ description: "User's password" }),
        firstName: t.Optional(t.String({ description: "User's first name" })),
        lastName: t.Optional(t.String({ description: "User's last name" }))
      }),
      detail: {
        summary: "Create a new user",
        description: "Register a new user with email and password"
      }
    })
    
    // Sign-in endpoint
    .post('/sign-in', async ({ body }) => {
      return await userService.login(body);
    }, {
      body: t.Object({
        email: t.String({ description: "User's email address" }),
        password: t.String({ description: "User's password" })
      }),
      detail: {
        summary: "User login",
        description: "Authenticate a user and receive a JWT token"
      }
    })
    
    // Get all users endpoint
    .get('/', async () => {
      return await userService.findAll();
    }, {
      detail: {
        summary: "Get all users",
        description: "Retrieve a list of all users"
      }
    })
    
    // Get user by ID endpoint
    .get('/:id', async ({ params: { id } }) => {
      const user = await userService.findById(id);
      if (!user) {
        return { error: 'User not found' };
      }
      return user;
    }, {
      params: t.Object({
        id: t.String({ description: "User ID" })
      }),
      detail: {
        summary: "Get a user by ID",
        description: "Retrieve a specific user by their ID"
      }
    })
    
    // Update user endpoint
    .put('/:id', async ({ params: { id }, body }) => {
      const user = await userService.update(id, body);
      if (!user) {
        return { error: 'User not found' };
      }
      return user;
    }, {
      params: t.Object({
        id: t.String({ description: "User ID" })
      }),
      body: t.Object({
        email: t.Optional(t.String({ description: "User's email" })),
        firstName: t.Optional(t.String({ description: "User's first name" })),
        lastName: t.Optional(t.String({ description: "User's last name" })),
        role: t.Optional(t.String({ description: "User's role" }))
      }),
      detail: {
        summary: "Update a user",
        description: "Update a user's information"
      }
    })
    
    // Change password endpoint
    .put('/:id/change-password', async ({ params: { id }, body }) => {
      const success = await userService.changePassword(id, body.password);
      if (!success) {
        return { error: 'User not found' };
      }
      return { success: true };
    }, {
      params: t.Object({
        id: t.String({ description: "User ID" })
      }),
      body: t.Object({
        password: t.String({ description: "New password" })
      }),
      detail: {
        summary: "Change password",
        description: "Change a user's password"
      }
    })
    
    // Delete user endpoint
    .delete('/:id', async ({ params: { id } }) => {
      const success = await userService.delete(id);
      if (!success) {
        return { error: 'User not found' };
      }
      return { success: true };
    }, {
      params: t.Object({
        id: t.String({ description: "User ID" })
      }),
      detail: {
        summary: "Delete a user",
        description: "Delete a user by their ID"
      }
    })
    
    // Get user by email endpoint
    .get('/by-email/:email', async ({ params: { email } }) => {
      const user = await userService.findByEmail(email);
      if (!user) {
        return { error: 'User not found' };
      }
      return user;
    }, {
      params: t.Object({
        email: t.String({ description: "User's email address" })
      }),
      detail: {
        summary: "Get a user by email",
        description: "Retrieve a specific user by their email address"
      }
    })
}