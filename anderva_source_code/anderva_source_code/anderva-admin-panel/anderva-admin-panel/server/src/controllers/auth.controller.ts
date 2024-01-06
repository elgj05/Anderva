import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  // MyUserService,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {CoreBindings, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  api,
  get,
  HttpErrors,
  post,
  requestBody,
  response,
  RestApplication,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {generateToken, hashPassword} from '../helper';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {CustomUserService} from '../services';

@api({basePath: '/api/auth'})
export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject('user.service')
    public userService: CustomUserService,
    @inject(SecurityBindings.USER, {optional: true})
    private user: UserProfile,
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: RestApplication,
  ) {}

  @post('/login')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
              password: {
                type: 'string',
                minLength: 3,
              },
            },
          },
        },
      },
    })
    credentials: Credentials,
  ): Promise<any> {
    const user = await this.userService.verifyCredentials(credentials);

    return {
      userData: _.omit(user, 'password'),
      accessToken: generateToken(this.userService.convertToUserProfile(user)),
    };
  }

  @authenticate('jwt')
  @get('/refresh-token')
  async refreshToken(): Promise<any> {
    return {
      accessToken: generateToken(this.user),
    };
  }

  @authenticate('jwt')
  @get('/current-user', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async currentUser(): Promise<any> {
    return this.user;
  }

  @post('/register', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password', 'name'],
            properties: {
              name: {
                type: 'string',
                minLength: 1,
              },
              email: {
                type: 'string',
                format: 'email',
              },
              password: {
                type: 'string',
                minLength: 3,
              },
            },
          },
        },
      },
    })
    user: any,
  ): Promise<any> {
    user.password = hashPassword(user.password);
    user.role = 'mobile';
    user.email = user.email.toLowerCase();

    if (await this.userRepository.findOne({where: {email: user.email}})) {
      throw new HttpErrors.NotFound('User with that email already exists!');
    }

    const createdUser = await this.userRepository.create(user);

    return {
      success: true,
      userData: _.omit(createdUser, 'password'),
      accessToken: generateToken(
        this.userService.convertToUserProfile(createdUser),
      ),
    };
  }
}
