import { MikroORM } from '@mikro-orm/core'


const main = async () => {
	const orm = await MikroORM.init({
		dbName: 'social-app',
		user: 'postgres',
		password: 'postgres',
		debug: true
	}); 

}

main()
