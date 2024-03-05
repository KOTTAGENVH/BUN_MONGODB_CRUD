import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const app = new Elysia();

// Check database connection on app start
app.listen(3000, async () => {
  try {
    await db.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the process if database connection fails
  }
});

// Add try-catch blocks to all database operations
// Add try-catch blocks to all database operations
app
.get("/users", async (req: any, res: any) => {
  try {
    const users = await db.user.findMany();
    if (!users) {
      res.status(404).send({ error: "No users found" });
    } else {
      return users;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: "Error fetching users from database" });
  }
})
  .post("/users", async (req) => {
    try {
      const { name, email }: any = req.body;
      const user = await db.user.create({
        data: {
          name,
          email,
        },
      });
      return user;
    } catch (error) {
      console.error("Error creating user in database:", error);
      throw error; // Rethrow the error to be handled by the framework
    }
  })

  .put("/users/:id", async (req) => {
    try {
      const { id } = req.params;
      const { name, email }: any = req.body;
  
      // Assuming db.user.update returns the updated user
      const updatedUser = await db.user.update({
        where: {
          id: id, // Ensure id is parsed as integer
        },
        data: {
          name,
          email,
        },
      });
  
      if (!updatedUser) {
        return({ error: "User not found" });
      } else {
        return(updatedUser);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return({ error: "Error updating user in database" });
    }
  })  
  .delete("/users/:id", async (req) => {
    try {
      const { id } = req.params;
      const user = await db.user.delete({
        where: {
          id: id,
        },
      });
     return(user);
    } catch (error) {
      return({ error: "Error deleting user from database" });
    }
  })
  .get("/users/:id", async (req) => {
    try {
      const { id } = req.params;
      const user = await db.user.findUnique({
        where: {
          id: id,
        },
      });
      return(user);
    } catch (error) {
      return({ error: "Error fetching user from database" });
    }
  })
  .get("/", () => "Hello World! from Elysia")
  .listen(3000, () =>
    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
    )
  );
