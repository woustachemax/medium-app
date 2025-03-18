import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
export const blogRouter = new Hono<{
    //@ts-ignore
    Bindings: {
          DATABASE_URL: string,
          JWT_SECRET: string,
      }
  }> ();


blogRouter.get('/:id', (c) => {
	const id = c.req.param('id')
	console.log(id);
	return c.text('get blog route')
})

blogRouter.post('/blog', async (c) => {
  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
		where: {
			email: body.email,
			password: body.password
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})

blogRouter.put('/blog', (c) => {
	return c.text('signin route')
})

blogRouter.get('/blig/bulk', (c) => {
	return c.json({msg : "hi"})
})
