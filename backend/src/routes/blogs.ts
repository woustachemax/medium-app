import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
// import { decode, verify } from "hono/jwt";
// import { use } from "hono/jsx";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables:{
	userId: string
  }
}>();

// blogRouter.use("*/", async (c, next) => {
// 	const authHeader = c.req.header("authorization") || "";
// 	const user =  verify(
// 		authHeader, c.env.JWT_SECRET
// 	);

// 	if (user){
// 		c.set("userId", user.id);
// 		next();
// 	}

//   	await next();
// });

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");
  const blog = await prisma.post.findUnique({
    where: { id: id as string },
  });

  if (!blog) {
    c.status(404);
    return c.json({ error: "Blog not found" });
  }

  return c.json(blog);
});

blogRouter.post("/blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user || user.password !== body.password) {
    c.status(403);
    return c.json({ error: "User not found or invalid credentials" });
  }

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: user.id,
    },
  });

  return c.json({ message: "Blog created successfully", blog });
});

blogRouter.put("/blog/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");
  const body = await c.req.json();

  const updatedBlog = await prisma.post.update({
    where: { id: id as string },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({ message: "Blog updated successfully", updatedBlog });
});

blogRouter.get("/blog/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.post.findMany();
  return c.json(blogs);
});
