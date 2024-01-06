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
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Event} from '../models';
import {EventRepository} from '../repositories';
import {CustomUserService} from '../services';

@api({basePath: '/api/events'})
@authenticate('jwt')
export class EventController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
    @inject('user.service')
    public userService: CustomUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
  ) {}

  @post('/')
  @response(200, {
    description: 'Event model instance',
    content: {'application/json': {schema: getModelSchemaRef(Event)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {
            title: 'NewEvent',
            exclude: ['id'],
          }),
        },
      },
    })
    event: Omit<Event, 'id'>,
  ): Promise<Event> {
    await this.userService.requiredRole(this.user, ['admin', 'org']);
    event.createdBy = this.user.id;

    return this.eventRepository.create(event);
  }

  // @get('/count')
  // @response(200, {
  //   description: 'Event model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(@param.where(Event) where?: Where<Event>): Promise<Count> {
  //   return this.eventRepository.count(where);
  // }

  @get('/')
  @response(200, {
    description: 'Array of Event model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Event, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Event) filter?: Filter<Event>): Promise<any> {
    const role = await this.userService.getUserRole(this.user);
    if (role === 'org') {
      filter = filter || {};
      filter.where = filter.where || {};
      (filter.where as any).createdBy = this.user.id;
    }

    const count = await this.eventRepository.count(filter?.where || {});

    return {
      data: await this.eventRepository.find(filter),
      ...count,
    };
  }

  // @patch('/')
  // @response(200, {
  //   description: 'Event PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Event, {partial: true}),
  //       },
  //     },
  //   })
  //   event: Event,
  //   @param.where(Event) where?: Where<Event>,
  // ): Promise<Count> {
  //   return this.eventRepository.updateAll(event, where);
  // }

  @get('/{id}')
  @response(200, {
    description: 'Event model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Event, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Event, {exclude: 'where'})
    filter?: FilterExcludingWhere<Event>,
  ): Promise<Event> {
    return this.eventRepository.findById(id, filter);
  }

  @patch('/{id}')
  @response(204, {
    description: 'Event PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {partial: true}),
        },
      },
    })
    event: Event,
  ): Promise<void> {
    await this.userService.requiredRole(this.user, ['admin', 'org']);
    const role = await this.userService.getUserRole(this.user);
    if (
      role === 'org' &&
      !(await this.eventRepository.findOne({
        where: {id, createdBy: this.user.id.toString()},
      }))
    ) {
      throw new HttpErrors.Unauthorized('Not authorized to edit this entry!');
    }

    await this.eventRepository.updateById(id, event);
  }

  // @put('/{id}')
  // @response(204, {
  //   description: 'Event PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() event: Event,
  // ): Promise<void> {
  //   await this.eventRepository.replaceById(id, event);
  // }

  @del('/{id}')
  @response(204, {
    description: 'Event DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<any> {
    await this.userService.requiredRole(this.user, ['admin', 'org']);
    const role = await this.userService.getUserRole(this.user);
    if (
      role === 'org' &&
      !(await this.eventRepository.findOne({
        where: {id, createdBy: this.user.id.toString()},
      }))
    ) {
      throw new HttpErrors.Unauthorized('Not authorized to delete this entry!');
    }
    await this.eventRepository.deleteById(id);
  }
}
