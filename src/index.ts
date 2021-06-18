import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';


const main = async () => {
	const orm = await MikroORM.init(mikroConfig); 
	orm.getMigrator().up();
	
	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false,
			
		}),
		context: () => ({ em: orm.em })
	})

	apolloServer.applyMiddleware({app})

	app.listen(3000, () => {
		console.log("Server listening on localhost:3000")
	})

	// const post = orm.em.create(Post, {title: "first post"});
	// await orm.em.persistAndFlush(post);
}

main()
