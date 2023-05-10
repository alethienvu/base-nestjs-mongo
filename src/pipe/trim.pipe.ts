import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimSpacePipe implements PipeTransform<any, any> {
  transform(value: string, _metadata: ArgumentMetadata): any {
    let val = value;
    if (typeof val === 'string') {
      val = val.trim();
    } else if (typeof val === 'object') {
      val = this.parse(val);
    }

    return val;
  }

  parse(object: any) {
    if (typeof object === 'object') {
      for (const key of Object.keys(object)) {
        if (!object[key]) {
          continue;
        }

        if (typeof object[key] === 'string') {
          // Ignore trimming password
          if (key === 'password') {
            continue;
          }
          object[key] = object[key].trim();
        }

        if (typeof object[key] === 'object') {
          object[key] = this.parse(object[key]);
        }
      }
    }

    return object;
  }
}
