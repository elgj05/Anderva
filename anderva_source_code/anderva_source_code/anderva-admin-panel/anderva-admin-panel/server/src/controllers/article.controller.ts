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
import {Article} from '../models';
import {ArticleRepository} from '../repositories';
import {CustomUserService} from '../services';

@api({basePath: '/api/articles'})
@authenticate('jwt')
export class ArticleController {
  constructor(
    @repository(ArticleRepository)
    public articleRepository: ArticleRepository,
    @inject('user.service')
    public userService: CustomUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
  ) {}

  @post('/')
  @response(200, {
    description: 'Article model instance',
    content: {'application/json': {schema: getModelSchemaRef(Article)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Article, {
            title: 'NewArticle',
            exclude: ['id'],
          }),
        },
      },
    })
    article: Omit<Article, 'id'>,
  ): Promise<Article> {
    await this.userService.requiredRole(this.user, 'admin');

    return this.articleRepository.create(article);
  }

  @get('/count')
  @response(200, {
    description: 'Article model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Article) where?: Where<Article>): Promise<Count> {
    // await this.userService.requiredRole(this.user, 'admin');

    return this.articleRepository.count(where);
  }

  @get('/')
  @response(200, {
    description: 'Array of Article model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Article, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Article) filter?: Filter<Article>): Promise<any> {
    // await this.userService.requiredRole(this.user, 'admin');
    const count = await this.articleRepository.count(filter?.where || {});

    return {
      data: await this.articleRepository.find(filter),
      ...count,
    };
  }

  // @patch('/')
  // @response(200, {
  //   description: 'Article PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Article, {partial: true}),
  //       },
  //     },
  //   })
  //   article: Article,
  //   @param.where(Article) where?: Where<Article>,
  // ): Promise<Count> {
  //   return this.articleRepository.updateAll(article, where);
  // }

  @get('/{id}')
  @response(200, {
    description: 'Article model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Article, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Article, {exclude: 'where'})
    filter?: FilterExcludingWhere<Article>,
  ): Promise<Article> {
    // await this.userService.requiredRole(this.user, 'admin');

    return this.articleRepository.findById(id, filter);
  }

  @patch('/{id}')
  @response(204, {
    description: 'Article PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Article, {partial: true}),
        },
      },
    })
    article: Article,
  ): Promise<void> {
    await this.userService.requiredRole(this.user, 'admin');

    await this.articleRepository.updateById(id, article);
  }

  // @put('/{id}')
  // @response(204, {
  //   description: 'Article PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() article: Article,
  // ): Promise<void> {
  //   await this.articleRepository.replaceById(id, article);
  // }

  @del('/{id}')
  @response(204, {
    description: 'Article DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userService.requiredRole(this.user, 'admin');

    await this.articleRepository.deleteById(id);
  }
}
