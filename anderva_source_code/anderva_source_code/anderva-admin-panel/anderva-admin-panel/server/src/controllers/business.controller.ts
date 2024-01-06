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
import {Business} from '../models';
import {BusinessRepository} from '../repositories';
import {CustomUserService} from '../services';

@api({basePath: '/api/businesses'})
@authenticate('jwt')
export class BusinessController {
  constructor(
    @repository(BusinessRepository)
    public businessRepository: BusinessRepository,
    @inject('user.service')
    public userService: CustomUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
  ) {}

  @post('/')
  @response(200, {
    description: 'Business model instance',
    content: {'application/json': {schema: getModelSchemaRef(Business)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Business, {
            title: 'NewBusiness',
            exclude: ['id'],
          }),
        },
      },
    })
    business: Omit<Business, 'id'>,
  ): Promise<Business> {
    await this.userService.requiredRole(this.user, 'admin');

    return this.businessRepository.create(business);
  }

  @get('/count')
  @response(200, {
    description: 'Business model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Business) where?: Where<Business>): Promise<Count> {
    return this.businessRepository.count(where);
  }

  @get('/')
  @response(200, {
    description: 'Get Data of Businesses',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: getModelSchemaRef(Business, {
                includeRelations: true,
              }),
            },
            count: {
              type: 'number',
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Business) filter?: Filter<Business>): Promise<any> {
    // await this.userService.requiredRole(this.user, ['admin', 'mobile']);
    const count = await this.businessRepository.count(filter?.where || {});
    filter = filter || {};
    filter.include = filter.include || ['category'];

    return {
      data: await this.businessRepository.find(filter),
      ...count,
    };
  }

  // @patch('/')
  // @response(200, {
  //   description: 'Business PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Business, {partial: true}),
  //       },
  //     },
  //   })
  //   business: Business,
  //   @param.where(Business) where?: Where<Business>,
  // ): Promise<Count> {
  //   return this.businessRepository.updateAll(business, where);
  // }

  @get('/{id}')
  @response(200, {
    description: 'Business model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Business, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Business, {exclude: 'where'})
    filter?: FilterExcludingWhere<Business>,
  ): Promise<Business> {
    // await this.userService.requiredRole(this.user, ['admin', 'mobile']);

    filter = filter || {};
    filter.include = filter.include || ['category'];

    return this.businessRepository.findById(id, filter);
  }

  @patch('/{id}')
  @response(204, {
    description: 'Business PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Business, {partial: true}),
        },
      },
    })
    business: Business,
  ): Promise<void> {
    await this.userService.requiredRole(this.user, 'admin');

    await this.businessRepository.updateById(id, business);
  }

  // @put('/{id}')
  // @response(204, {
  //   description: 'Business PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() business: Business,
  // ): Promise<void> {
  //   await this.businessRepository.replaceById(id, business);
  // }

  @del('/{id}')
  @response(204, {
    description: 'Business DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userService.requiredRole(this.user, 'admin');

    await this.businessRepository.deleteById(id);
  }
}
