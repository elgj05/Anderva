import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {UserRepository} from '.';
import {MongoDataSource} from '../datasources';
import {Event, EventRelations, User} from '../models';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
> {
  createdByUser: BelongsToAccessor<User, typeof Event.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Event, dataSource);

    this.createdByUser = this.createBelongsToAccessorFor(
      'createdByUser',
      userRepositoryGetter,
    );
    this.registerInclusionResolver(
      'createdByUser',
      this.createdByUser.inclusionResolver,
    );
  }
}
