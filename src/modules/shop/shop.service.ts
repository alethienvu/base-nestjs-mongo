import { Injectable } from '@nestjs/common';
import { ShopRepository } from './shop.repository';
import { CreateShopDto, IndexShopInput } from './shop.dto';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { NotFoundError } from 'src/shared/common.errors';
import { ShopStatus } from 'src/shared/enum/shop.const';
import { handleApiClientError } from 'src/errors/errors';
import { getHeaders } from 'src/adapters/pagination/pagination.helper';
import { db2api } from 'src/shared/data.prettifier';
import { IShop } from './shop.interface';
import { IPagination, IPaginationHeader } from 'src/adapters/pagination/pagination.interface';

@Injectable()
export class ShopService {
  constructor(
    private readonly shopRepository: ShopRepository,
    private readonly mailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  async createShop(createShopDto: CreateShopDto) {
    const { userId } = createShopDto;
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundError(`Cannot found user ${userId}`);
    }
    const createdShop = await this.shopRepository.withTransaction(async (session) => {
      return this.shopRepository
        .save(
          {
            status: ShopStatus.ACTIVE,
            ...createShopDto,
          },
          { session },
        )
        .catch((error) => {
          handleApiClientError(error);
        });
    });
    this.mailService.sendSignupMail({
      email: user.email,
      subject: 'Create shop successfully!',
      content: `You create a shop successfully. Shop name: ${createShopDto.name}`,
    });
    return createdShop;
  }

  async indexShops(
    filters: IndexShopInput,
    pagination: IPagination,
  ): Promise<{ items: IShop[]; headers: IPaginationHeader }> {
    const searchParams: any = {};
    //#region
    if (filters.id) {
      searchParams.id = filters.id;
    }
    if (filters.userId) {
      searchParams.userId = filters.userId;
    }
    if (filters.name) {
      searchParams.name = { $regex: new RegExp(filters.name, 'i') };
    }
    if (filters.status) {
      searchParams.status = filters.status;
    }
    //#endregion
    const txCount = await this.shopRepository.count({
      ...searchParams,
    });

    const responseHeaders = getHeaders(pagination, txCount);
    let transactions = await this.shopRepository.findAll(searchParams, {
      skip: pagination.startIndex,
      limit: pagination.perPage,
      sort: '-createdAt',
    });

    transactions = db2api(transactions);

    return {
      items: transactions,
      headers: responseHeaders,
    };
  }
}
