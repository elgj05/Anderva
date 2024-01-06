import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {CategoryRepository} from '.';
import {MongoDataSource} from '../datasources';
import {Business, BusinessRelations, Category} from '../models';

export class BusinessRepository extends DefaultCrudRepository<
  Business,
  typeof Business.prototype.id,
  BusinessRelations
> {
  category: BelongsToAccessor<Category, typeof Business.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('CategoryRepository')
    categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Business, dataSource);

    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
