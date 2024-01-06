import {belongsTo, model, property} from '@loopback/repository';
import {Base, User} from '.';

@model()
export class Event extends Base {
  @property({
    type: 'string',
  })
  title: string;

  @property({
    type: 'string',
  })
  image: string;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'string',
  })
  eventUrl: string;

  @property({
    type: 'string',
  })
  location: string;

  @property({
    type: 'date',
  })
  datetimeStart: string;

  @property({
    type: 'date',
  })
  datetimeEnd: string;

  @belongsTo(() => User, {name: 'createdByUser'})
  createdBy: string;

  constructor(data?: Partial<Event>) {
    super(data);
  }
}

export interface EventRelations {
  // describe navigational properties here
}

export type EventWithRelations = Event & EventRelations;
