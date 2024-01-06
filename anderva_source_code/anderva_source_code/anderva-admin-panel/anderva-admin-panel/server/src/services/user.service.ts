import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';

import {User} from '../models';
import {UserRepository} from '../repositories';

export type Credentials = {
  email: string;
  password: string;
};

export class CustomUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<any> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    // const credentialsFound = await this.userRepository.findCredentials(
    //   foundUser.id,
    // );
    // if (!credentialsFound) {
    //   throw new HttpErrors.Unauthorized(invalidCredentialsError);
    // }

    const passwordMatched = await compare(
      credentials.password,
      foundUser.password as string,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  // User --> User
  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id.toString(),
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async requiredRole(user: UserProfile, role: string | string[]) {
    if (!user) {
      throw new HttpErrors.Unauthorized('Not logged in!');
    }
    const userData = await this.userRepository.findById(user.id, {
      fields: ['role'],
    });
    if (
      !userData?.role ||
      (typeof role==='string' && userData.role !== role) ||
      (Array.isArray(userData.role) && !role.includes(userData.role))
    ) {
      throw new HttpErrors.Unauthorized(
        'No role access! [' + userData.role + '>' + role + ']',
      );
    }
  }

  async getUserRole(user: UserProfile): Promise<string> {
    if (!user) {
      throw new HttpErrors.Unauthorized('Not logged in!');
    }
    const userData = await this.userRepository.findById(user.id, {
      fields: ['role'],
    });
    return userData.role;
  }
}
