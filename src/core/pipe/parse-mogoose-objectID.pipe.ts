import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongooseObjectIdPipe implements PipeTransform {
  transform(value: string, _: ArgumentMetadata) {
    if (!isValidObjectId(value))
      throw new HttpException(
        'the id that was provided is not valid!',
        HttpStatus.BAD_REQUEST,
      );
    return value;
  }
}
