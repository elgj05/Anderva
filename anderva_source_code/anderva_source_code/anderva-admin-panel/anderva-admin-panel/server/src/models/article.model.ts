import {model, property} from '@loopback/repository';
import {Base} from '.';

@model()
export class Article extends Base {
  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'string',
  })
  videoUrl?: string;

  @property({
    type: 'string',
  })
  description?: string;


  constructor(data?: Partial<Article>) {
    super(data);
  }
}

export interface ArticleRelations {
  // describe navigational properties here
}

export type ArticleWithRelations = Article & ArticleRelations;
