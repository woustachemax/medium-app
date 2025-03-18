import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
export const userRouter = new Hono<{
    //@ts-ignore
    Bindings: {
          DATABASE_URL: string,
          JWT_SECRET: string,
      }
  }> ();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      //@ts-ignore
  
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
      try {
          const user = await prisma.user.create({
              data: {
                  email: body.email,
                  password: body.password
              }
          });
          const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
          return c.json({ jwt });
      } catch(e) {
          c.status(403);
          return c.json({ error: "error while signing up" });
      }
  })
  
  
  userRouter.post('/signin', async (c) => {
      const prisma = new PrismaClient({
          //@ts-ignore
      
          datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());
    try {
      const signinBody = await c.req.json();
      
      const userExists = await prisma.user.findUnique({
        where: {
          email: signinBody.username,
          password: signinBody.password
        }
      });
  
      if (!userExists || userExists.password !== signinBody.password) {
        c.status(403);
        return c.json({ error: 'Invalid credentials' });
      }
  
      const jwt = await sign(
        { id: userExists.id },
        c.env.JWT_SECRET,
      );
  
      return c.json({ token: jwt });
  
    } catch (e) {
      console.error(e);
      c.status(500);
      return c.json({ error: 'Internal server error' });
    }
  });
  

  

  