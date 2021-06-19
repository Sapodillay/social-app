import { User } from "../entities/User";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { MyContext } from "../types";


@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;
	@Field()
	password: string;
}





@ObjectType()
class UserResponse {

	@Field(() => [FieldError], {nullable: true})
	errors?: FieldError[]

	@Field(() => User, {nullable: true})
	user?: User
}


@ObjectType()
class FieldError {
	@Field()
	field: string

	@Field()
	message: string

}


@Resolver()
export class UserResolver{

	@Mutation(() => UserResponse)
	async register(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { em }: MyContext
	): Promise<UserResponse>{

		if (options.username.length <= 2){
			return {
				errors: [{
					field: "username",
					message: "Username too short, please make your username name more than 2"
				}]
			}
		}
		if (options.password.length <= 2){
			return {
				errors: [{
					field: "password",
					message: "Password too short, please make your password name more than 2"
				}]
			}
		}

		const doesExist = (await em.findOne(User, {username: options.username}))
		if (doesExist){
			return {
				errors: [{
					field: "username",
					message: "Username is taken"
				}]
			}
		}



		const hashedPassword = await argon2.hash(options.password)
		const user = em.create(User, {username: options.username, password: hashedPassword})

		try{
		await em.persistAndFlush(user)
		return {
			user: user
		}
		}catch(err){
			console.error(err)
			return {
				errors: [{
					field: "username",
					message: "a server error occured",
				}]
			}
		}
	}






	@Mutation(() => UserResponse)
	async login(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, {username: options.username})

		if (!user){
			return {
				errors: [{
					field: "username",
					message: "that username doesn't exist"
				}]
			}
		}
		const valid = await argon2.verify(user.password, options.password)

		if (!valid){
			return {
				errors: [{
					field: "password",
					message: "password was not correct"
				}]
			}
		}


		req.session.userId = user.id

		return {
			user: user
		}


	}


}