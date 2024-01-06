import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  api,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Category} from '../models';
import {CategoryRepository} from '../repositories';
import {CustomUserService} from '../services';

@api({basePath: '/api/categories'})
export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
    @inject('user.service')
    public userService: CustomUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
  ) {}

  @authenticate('jwt')
  @post('/')
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    category: Omit<Category, 'id'>,
  ): Promise<Category> {
    await this.userService.requiredRole(this.user, 'admin');

    return this.categoryRepository.create(category);
  }

  @get('/count')
  @response(200, {
    description: 'Category model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Category) where?: Where<Category>): Promise<Count> {
    return this.categoryRepository.count(where);
  }

  @get('/')
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Category, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Category) filter?: Filter<Category>,
    @param.query.boolean('counted') counted: boolean = false,
  ): Promise<any> {
    if (counted) {
      const count = await this.categoryRepository.count(filter?.where || {});
      return {
        data: await this.categoryRepository.find(filter),
        ...count,
      };
    } else {
      return this.categoryRepository.find(filter);
    }
  }

  // @patch('/')
  // @response(200, {
  //   description: 'Category PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Category, {partial: true}),
  //       },
  //     },
  //   })
  //   category: Category,
  //   @param.where(Category) where?: Where<Category>,
  // ): Promise<Count> {
  //   return this.categoryRepository.updateAll(category, where);
  // }

  @authenticate('jwt')
  @get('/{id}')
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Category, {exclude: 'where'})
    filter?: FilterExcludingWhere<Category>,
  ): Promise<Category> {
    // await this.userService.requiredRole(this.user, 'admin');

    return this.categoryRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/{id}')
  @response(204, {
    description: 'Category PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
  ): Promise<void> {
    await this.userService.requiredRole(this.user, 'admin');

    await this.categoryRepository.updateById(id, category);
  }

  // @put('/{id}')
  // @response(204, {
  //   description: 'Category PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() category: Category,
  // ): Promise<void> {
  //   await this.categoryRepository.replaceById(id, category);
  // }

  @authenticate('jwt')
  @del('/{id}')
  @response(204, {
    description: 'Category DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userService.requiredRole(this.user, 'admin');

    await this.categoryRepository.deleteById(id);
  }
}
