import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";


@ObjectType()//Type decorator to convert into a graphql type
@Entity()
export class Post {

	@Field(() => Int) //Field types for graphql
	@PrimaryKey()
	id!: number;

	@Field(() => String)
	@Property({type: 'date'})
	createdAt = new Date()

	@Field(() => String)
	@Property({type: 'date', onUpdate: () => new Date() })
	updatedAt = new Date();

	@Field(() => String)
	@Property({type: 'text'})
	title!: string;


}