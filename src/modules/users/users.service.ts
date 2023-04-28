import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { IUser } from './users.interface';
import { Errors } from 'src/errors/errors';
import { ErrorCode } from 'src/errors/errors.interface';
import { CreateUserDto } from './dtos/createUser.dto';
import * as crypto from 'crypto';
import { v4 as uuidV4 } from 'uuid';
import { UserRole, UserStatus } from 'src/shared/enum/users.const';
import { UpdatePassWordDto, UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
  ) {}

  /**
   *
   * @param email
   * @returns existed: true | false
   */
  async checkUserEmailAddressExisted(email): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    return !user ? false : true;
  }

  /**
   *
   * @param email
   * @returns user with email
   */
  async findUserByEmailAddress(email: string): Promise<IUser> {
    const user = this.userRepository.findOne({ email });
    return user;
  }

  /**
   *
   * @param id
   * @returns user with id
   */
  async findUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new BadRequestException(Errors[ErrorCode.ACCOUNT_NOT_FOUND]);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const sameEmailAddress = await this.checkUserEmailAddressExisted(email);
    if (!!sameEmailAddress) {
      throw new BadRequestException(Errors[ErrorCode.EMAIL_IS_ALREADY_TAKEN]);
    }
    const hashPass = crypto.createHmac('sha256', password).digest('hex');
    const newUser = await this.userRepository.withTransaction(async (session) => {
      return this.userRepository
        .save(
          {
            id: uuidV4(),
            email,
            password: hashPass,
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
          },
          { session },
        )
        .catch((error) => {
          throw new BadRequestException(`Create account for ${email} fail!`, error.message);
        });
    });
    return newUser;
  }

  async updateUser(id: string, updateUser: UpdateUserDto) {
    const currentUser = await this.findUserById(id);
    if (updateUser.address) {
      currentUser.address = updateUser.address;
    }
    if (updateUser.first_name) {
      currentUser.first_name = updateUser.first_name;
    }
    if (updateUser.last_name) {
      currentUser.last_name = updateUser.last_name;
    }
    const updatedUser = await this.userRepository.save(currentUser);
    console.log("🚀🚀🚀 ~ file: users.service.ts:89 ~ UsersService ~ updateUser ~ updatedUser:", updatedUser);
    return updatedUser;
  }

  async changePassWord(id: string, updatePassWordDto: UpdatePassWordDto){
    const currentUser = await this.findUserById(id);
    const { currently_pass, new_pass } = updatePassWordDto;
    const compare_pass = crypto.createHmac('sha256', currently_pass).digest('hex');
    if (currentUser.password !== compare_pass) {
      throw new BadRequestException(Errors[ErrorCode.GENERAL_UNAUTHORIZED_EXCEPTION]);
    }
    currentUser.password = crypto.createHmac('sha256', new_pass).digest('hex');
    const updatedUser = await this.userRepository.save(currentUser);
    console.log("🚀🚀🚀 ~ file: users.service.ts:102 ~ UsersService ~ changePassWord ~ updatedUser:", updatedUser);
    return updatedUser;
  }
}
