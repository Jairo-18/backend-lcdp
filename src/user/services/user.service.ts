import { UserRepository } from '../../shared/repositories/user.repository';
import { User } from '../../shared/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NOT_FOUND_MESSAGE } from '../../shared/constants/messages.constant';

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  async findOne(id: string): Promise<User> {
    const user = await this._userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByParams(params: Record<string, any>): Promise<User> {
    return await this._userRepository.findOne({ where: params });
  }
}
