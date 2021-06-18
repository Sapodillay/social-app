import { Post } from "./entities/Post";
import { MikroORM } from '@mikro-orm/core'
import path from 'path'
import { User } from "./entities/User";

export default {
	migrations: {
		path: path.join(__dirname + '/migrations'), // path to folder with migration files
		pattern: /^[\w-]+\d+\.[tj]s$/, // how to match migration files
	},
	entities: [Post, User],
	dbName: 'social-app',
	type: 'postgresql',
	user: 'postgres',
	password: 'postgres',
	debug: true
} as Parameters<typeof MikroORM.init>[0];