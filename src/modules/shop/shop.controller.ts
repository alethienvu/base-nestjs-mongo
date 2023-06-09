import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AUTH_HEADERS } from '../../shared/constants';
import { ShopService } from './shop.service';
import { CreateShopDto, IndexShopInput } from './shop.dto';
import { IPagination, IPaginationHeader } from 'src/adapters/pagination/pagination.interface';
import { PaginationInterceptor } from 'src/interceptor/pagination.interceptor';
import { CommonQueryRequest, Pagination } from 'src/shared/decorators/pagination.decorator';
import { IShop } from './shop.interface';
import { CommonErrorResponses } from 'src/shared/decorators/common-error.decorator';
import { TrimSpacePipe } from 'src/pipe/trim.pipe';

@Controller('shop')
@ApiBearerAuth(AUTH_HEADERS.ACCESS_TOKEN)
@ApiTags('Shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get()
  @ApiOperation({
    operationId: 'indexTransactions',
    description: 'Index fuel subsidy transactions',
    summary: 'Index fuel subsidy transactions',
  })
  @UseInterceptors(PaginationInterceptor)
  @CommonQueryRequest()
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @UseGuards(JwtAuthGuard)
  indexFuelSubsidyTransaction(
    @Pagination() pagination: IPagination,
    @Query() filters: IndexShopInput,
  ): Promise<{ items: IShop[]; headers: IPaginationHeader }> {
    return this.shopService.indexShops(filters, pagination);
  }

  @Post('')
  @ApiOperation({
    operationId: 'create-shop',
    description: 'Create a shop',
    summary: 'Create a shop',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @UseGuards(JwtAuthGuard)
  async createShop(@Body(TrimSpacePipe) createShopDto: CreateShopDto) {
    const createdUser = await this.shopService.createShop(createShopDto);
    return createdUser;
  }
}
