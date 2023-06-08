import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { MaxImgSize } from 'src/shared/constants';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    return value.size < MaxImgSize;
  }
}
