import {model, property} from '@loopback/repository';
import {Base} from '.';

@model()
export class Category extends Base {
  @property({
    type: 'string',
    required: true,
  })
  name: string;


  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
