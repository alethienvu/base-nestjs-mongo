import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { IUser } from './users.interface';
import { handleApiClientError } from '../../errors/errors';
import { CreateUserDto } from './dtos/createUser.dto';
import * as crypto from 'crypto';
import { v4 as uuidV4 } from 'uuid';
import { UserRole, UserStatus } from '../../shared/enum/users.const';
import { UpdatePassWordDto, UpdateUserDto } from './dtos/updateUser.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    @Inject(forwardRef(() => EmailService))
    private readonly mailService: EmailService,
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
      throw new NotFoundException(`Not found user with id: ${id}`);
    }
    return user;
  }

  async findUserWithPasswordById(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneWithPass({ id });
    if (!user) {
      throw new NotFoundException(`Not found user with id: ${id}`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const sameEmailAddress = await this.checkUserEmailAddressExisted(email);
    if (!!sameEmailAddress) {
      throw new BadRequestException(`Email is already taken`);
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
          handleApiClientError(error);
        });
    });
    this.mailService.sendSignupMail({
      email: createUserDto.email,
      subject: 'Sign up to LiMall successfully!',
      content: 'You signed up to LiMall',
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

    return updatedUser;
  }

  async changePassWord(id: string, updatePassWordDto: UpdatePassWordDto) {
    const currentUser = await this.findUserWithPasswordById(id);
    const { currently_pass, new_pass } = updatePassWordDto;
    const compare_pass = crypto.createHmac('sha256', currently_pass).digest('hex');
    if (currentUser.password !== compare_pass) {
      throw new BadRequestException(`Wrong pass`);
    }
    currentUser.password = crypto.createHmac('sha256', new_pass).digest('hex');
    const updatedUser = await this.userRepository.save(currentUser);
    return updatedUser;
  }
}
