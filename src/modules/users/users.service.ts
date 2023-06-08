import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { IAvatarBase, IUser } from './users.interface';
import { handleApiClientError } from '../../errors/errors';
import { CreateUserDto } from './dtos/createUser.dto';
import * as crypto from 'crypto';
import { UserRole, UserStatus } from '../../shared/enum/users.const';
import { ForgotPassDto, UpdatePassWordDto, UpdateUserDto } from './dtos/updateUser.dto';
import { EmailService } from '../email/email.service';
import { updateObject } from 'src/shared/helpers';
import { generatePassword } from 'src/shared/utils';
import { extname } from 'path';
import { readFileSync, unlinkSync } from 'fs';
import { Readable } from 'stream';
import { errorLog } from 'src/shared/logger';
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    @Inject(forwardRef(() => EmailService))
    private readonly mailService: EmailService,
  ) {}

  async checkUserEmailAddressExisted(email): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    return !user ? false : true;
  }

  /**
   *
   * @param email
   * @returns user without password
   */
  async findUserByEmailAddress(email: string): Promise<IUser> {
    const user = this.userRepository.findOne({ email });
    return user;
  }

  /**
   *
   * @param id
   * @returns user without password
   */
  async findUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Not found user with id: ${id}`);
    }
    return user;
  }

  /**
   *
   * @param id
   * @returns user document with password
   */
  async findUserWithPasswordById(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneWithPass(id);
    if (!user) {
      throw new NotFoundException(`Not found user with id: ${id}`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const sameEmailAddress = await this.checkUserEmailAddressExisted(email);
    if (sameEmailAddress) {
      throw new BadRequestException(`Email is already taken`);
    }
    const hashPass = crypto.createHmac('sha256', password).digest('hex');
    const newUser = await this.userRepository.withTransaction(async (session) => {
      return this.userRepository
        .save(
          {
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
    updateObject(currentUser, updateUser);
    const updatedUser = await this.userRepository.save(currentUser);

    return updatedUser;
  }

  async updateAvatar(id: string, file: Express.Multer.File) {
    const currentUser = await this.findUserById(id);
    const savedAvatar = await this.userRepository.findAvatarByUserId(id);
    if (savedAvatar) {
      await this.userRepository.deleteOneAvatar(savedAvatar.id);
    }
    const img = readFileSync(file.path);
    const encode_img = img.toString('base64');
    const avatar: IAvatarBase = {
      fileName: `ava-${Date.now()}${extname(file.originalname)}`,
      type: file.mimetype,
      stream: Buffer.from(encode_img, 'base64'),
      userId: currentUser.id,
    };
    await this.userRepository.saveAvatar(avatar);
    // Delete file saved in server
    try {
      unlinkSync(file.path);
    } catch (error) {
      errorLog(error);
    }
    return avatar.fileName;
  }

  async getStreamAvatarById(id: string): Promise<{ stream: Readable; headers: any }> {
    const image = await this.userRepository.findAvatarByUserId(id);

    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    const stream = Readable.from(image.stream);

    // Set response headers
    const headers = {
      'Content-Type': image.type,
      'Content-Length': image.stream.length,
      'Content-Disposition': `attachment; filename="${image.fileName}"`,
    };

    return { stream, headers };
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

  async forgotPass(forgotPassDto: ForgotPassDto) {
    const user = await this.findUserByEmailAddress(forgotPassDto.email);
    if (!user) {
      throw new NotFoundException(`Not found user have email: ${forgotPassDto.email}`);
    }
    const userWPass = await this.findUserWithPasswordById(user.id);
    const newPass = generatePassword();
    userWPass.password = crypto.createHmac('sha256', newPass).digest('hex');
    const updatedUser = await this.userRepository.save(userWPass);
    this.mailService.sendSignupMail({
      email: forgotPassDto.email,
      subject: 'Your Password Updated!',
      content: `Your new password is: ${newPass}`,
    });
    return updatedUser;
  }
}
