import {model, property} from '@loopback/repository';
import {Base} from '.';

@model({settings: {strict: false}})
export class User extends Base {
  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
    default: null,
  })
  password?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['mobile', 'org', 'admin', 'subscriber'],
    },
  })
  role: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
