import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors'

const main = async () => {
	const orm = await MikroORM.init(mikroConfig); 
	orm.getMigrator().up();
	
	const app = express();

	const RedisStore = connectRedis(session)
	const redisClient = redis.createClient()

	app.use(cors({
		origin: 'http://localhost:3000',
		credentials: true
	}))

	app.use(
		session({
			name: 'qid',
			store: new RedisStore(
				{ 
					client: redisClient,
					 disableTouch: true
				}
			),
			saveUninitialized: false,
			secret: "dwadwadhjyrdgsfddwadesecretadewadwadaw",
			resave: false,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Days
				httpOnly: true,
				sameSite: 'lax',
				secure: false
			}
		})
	)


	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false,
			
		}),
		context: ({req, res}): MyContext => ({ em: orm.em, req, res })
	})

	apolloServer.applyMiddleware({
		app, 
		cors: false,
	})

	app.listen(4000, () => {
		console.log("Server listening on localhost:4000")
	})

	// const post = orm.em.create(Post, {title: "first post"});
	// await orm.em.persistAndFlush(post);
}

main()
