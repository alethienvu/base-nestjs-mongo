import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validationErrorsFormatter = (validationErrors) => {
  const messages = {};
  if (validationErrors.length) {
    validationErrors.map((item) => {
      if (item.children.length) {
        messages[item.property] = validationErrorsFormatter(item.children);
        return;
      }

      const objKeys = Object.keys(item.constraints);
      messages[item.property] = messages[item.property] || [];
      objKeys.map((constraint, _i) => {
        messages[item.property].push(item.constraints[constraint]);
      });
    });
  }
  return messages;
};

export const prepareValidationErrors = (
  validationResults: ValidationError[],
  constraintsArr: any[] = [],
) => {
  if ((validationResults && validationResults.length > 0) || constraintsArr.length) {
    validationResults.map((item) => {
      const { constraints, property } = item;
      constraintsArr.push({ constraints, property });
    });
  }
};

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const formattedErrors = validationErrorsFormatter(errors);
      const errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        errors: formattedErrors,
      };
      throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
