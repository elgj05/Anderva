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
  HttpErrors,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {hashPassword} from '../helper';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {CustomUserService} from '../services';

@api({basePath: '/api/users'})
@authenticate('jwt')
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('user.service')
    public userService: CustomUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
  ) {}

  @post('/')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<any> {
    await this.userService.requiredRole(this.user, 'admin');

    user.email = user.email.toLowerCase();
    if (await this.userRepository.findOne({where: {email: user.email}})) {
      throw new HttpErrors.NotFound('User with that email already exists!');
    }
    user.password = hashPassword(user.password);

    return this.userRepository.create(user);
  }

  @get('/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    await this.userService.requiredRole(this.user, 'admin');

    return this.userRepository.count(where);
  }

  @get('/')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: getModelSchemaRef(User, {
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
  async find(@param.filter(User) filter?: Filter<User>): Promise<any> {
    await this.userService.requiredRole(this.user, 'admin');
    const count = await this.userRepository.count(filter?.where || {});
    filter = filter || {};
    filter.fields = filter.fields || {password: false};

    return {
      data: await this.userRepository.find(filter),
      ...count,
    };
  }

  // @patch('/')
  // @response(200, {
  //   description: 'User PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {partial: true}),
  //       },
  //     },
  //   })
  //   user: User,
  //   @param.where(User) where?: Where<User>,
  // ): Promise<Count> {
  //   await this.userService.requiredRole(this.user, 'admin');
  //
  //   return this.userRepository.updateAll(user, where);
  // }

  @get('/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    await this.userService.requiredRole(this.user, 'admin');

    return this.userRepository.findById(id, filter);
  }

  @patch('/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') userId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<any> {
    await this.userService.requiredRole(this.user, 'admin');

    // avoid duplicate email
    if (user.email) {
      user.email = user.email.toLowerCase();
      if (
        await this.userRepository.findOne({
          where: {email: user.email, id: {nin: [userId]}},
        })
      ) {
        throw new HttpErrors.NotAcceptable(
          'User with that email already exists!',
        );
      }
    }

    if (user.password && user.password.length) {
      user.password = hashPassword(user.password);
    }

    await this.userRepository.updateById(userId, user);
  }

  // @put('/{id}')
  // @response(204, {
  //   description: 'User PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() user: User,
  // ): Promise<void> {
  //   await this.userService.requiredRole(this.user, 'admin');
  //
  //   await this.userRepository.replaceById(id, user);
  // }

  @del('/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userService.requiredRole(this.user, 'admin');

    await this.userRepository.deleteById(id);
  }
}
