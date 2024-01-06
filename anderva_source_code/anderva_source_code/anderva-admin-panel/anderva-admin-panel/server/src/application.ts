import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  RefreshTokenServiceBindings,
  TokenServiceBindings,
  // UserServiceBindings,
} from '@loopback/authentication-jwt';
// import {MongoDataSource} from './datasources';
import {CustomUserService} from './services';
// import {UserRepository} from './repositories';

export {ApplicationConfig};

export class BackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    // options.rest.cors = {
    //   origin: '*',
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //   preflightContinue: false,
    //   optionsSuccessStatus: 204,
    //   maxAge: 86400,
    //   credentials: true,
    // }

    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    // this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    // this.configure(RestExplorerBindings.COMPONENT).to({
    //   path: '/api/explorer',
    // });
    // this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);

    // for jwt access token
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      process.env.JWT_TOKEN_SECRET as string,
    );
    // for refresh token
    this.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
    );
    // expire
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      process.env.JWT_EXPIRE_IN as string,
    );
    this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(
      process.env.JWT_EXPIRE_IN as string,
    );

    // Bind datasource
    // this.dataSource(MongoDataSource, UserServiceBindings.DATASOURCE_NAME);
    // Bind user service
    this.bind('user.service').toClass(CustomUserService);
    // Bind user
    // this.bind(UserServiceBindings.USER_REPOSITORY).toClass(UserRepository);
    // ----

    this.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
      json: {limit: '8MB'},
      text: {limit: '2MB'},
    });

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
