import {belongsTo, model, property} from '@loopback/repository';
import {Base} from '.';
import {Category} from '.';

@model({settings: {strict: false}})
export class Business extends Base {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  image: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  moreInfoUrl: string;

  @belongsTo(() => Category)
  categoryId: string;

  @property({
    type: 'string',
    required: true,
  })
  couponCode: string;

  @property({
    type: 'string',
    required: true,
  })
  couponDescription: string;

  @property({
    type: 'string',
    required: true,
  })
  locationAddress: string;

  @property({
    type: 'string',
    required: true,
  })
  locationUrl: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  constructor(data?: Partial<Business>) {
    super(data);
  }
}

export interface BusinessRelations {
  // describe navigational properties here
}

export type BusinessWithRelations = Business & BusinessRelations;
