import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blogs';
// Create the main Hono app
const app = new Hono<{
  //@ts-ignore
  Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}> ();

// const userSchema = [{
// 	username: z.string(),
// 	password: z.string().min(8)
// }]


app.route('/api/v1/user', userRouter);
app.route('/ap1/v1/blog', blogRouter);


export default app;
