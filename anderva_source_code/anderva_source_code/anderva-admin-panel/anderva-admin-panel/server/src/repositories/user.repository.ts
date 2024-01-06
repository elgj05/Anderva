import {inject} from '@loopback/core';
import {MongoDataSource} from '../datasources';
import {User, UserRelations} from '../models';
import {BaseRepository} from './base.repository';

export class UserRepository extends BaseRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(User, dataSource);
  }
}
