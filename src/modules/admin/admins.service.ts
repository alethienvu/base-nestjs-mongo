import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { handleApiClientError } from '../../errors/errors';
import * as crypto from 'crypto';
import { UserStatus } from '../../shared/enum/users.const';
import { EmailService } from '../email/email.service';
import { UsersRepository } from '../users/users.repository';
import { IUser } from '../users/users.interface';
import { CreateAdminDto, LockUserDto } from './types/createAdmin.dto';
import { db2api } from 'src/shared/data.prettifier';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UsersRepository,
    @Inject(forwardRef(() => EmailService))
    private readonly mailService: EmailService,
  ) {}

  async checkUserEmailAddressExisted(email): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    return !user ? false : true;
  }

  async findUserByEmailAddress(email: string): Promise<IUser> {
    const user = this.userRepository.findOne({ email });
    return user;
  }

  async findUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Not found user with id: ${id}`);
    }
    return user;
  }

  async findUserWithPasswordById(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneWithPass(id);
    if (!user) {
      throw new NotFoundException(`Not found user with id: ${id}`);
    }
    return user;
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<IUser> {
    const { email, password, role } = createAdminDto;
    const sameEmailAddress = await this.checkUserEmailAddressExisted(email);
    if (!!sameEmailAddress) {
      throw new BadRequestException(`Email is already taken`);
    }
    const hashPass = crypto.createHmac('sha256', password).digest('hex');
    const newUser = await this.userRepository.withTransaction(async (session) => {
      return this.userRepository
        .save(
          {
            // id: uuidV4(),
            email,
            password: hashPass,
            role,
            status: UserStatus.ACTIVE,
          },
          { session },
        )
        .catch((error) => {
          handleApiClientError(error);
        });
    });
    this.mailService.sendSignupMail({
      email: createAdminDto.email,
      subject: 'Sign up to LiMall successfully!',
      content: 'You signed up to LiMall',
    });
    return db2api(newUser);
  }

  async deleteUser(id: string): Promise<any> {
    const currentUser = await this.findUserById(id);
    const removedUser = await this.userRepository.deleteOne(id);
    this.mailService.sendSignupMail({
      email: currentUser.email,
      subject: 'Your account has been deleted',
      content: 'Your account has been deleted!',
    });
    return removedUser;
  }

  async lockOrDeActiveUser(id: string, lockUserDto: LockUserDto): Promise<IUser> {
    const currentUser = await this.findUserById(id);
    currentUser.status = lockUserDto.status;
    const updatedUser = await this.userRepository.save(currentUser);
    this.mailService.sendSignupMail({
      email: currentUser.email,
      subject: 'Your account has been updated',
      content: `Your account status updated to ${lockUserDto.status}`,
    });
    return db2api(updatedUser);
  }
}
