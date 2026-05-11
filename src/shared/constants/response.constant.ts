import { HttpStatus } from '@nestjs/common';
import {
  CREATED_MESSAGE,
  DELETED_MESSAGE,
  DUPLICATED_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  UPDATED_MESSAGE,
} from './messages.constant';

export const CREATED_RESPONSE = {
  status: HttpStatus.CREATED,
  description: CREATED_MESSAGE,
};

export const UPDATED_RESPONSE = {
  status: HttpStatus.OK,
  description: UPDATED_MESSAGE,
};

export const DELETED_RESPONSE = {
  status: HttpStatus.OK,
  description: DELETED_MESSAGE,
};

export const DUPLICATED_RESPONSE = {
  status: HttpStatus.CONFLICT,
  description: DUPLICATED_MESSAGE,
};

export const NOT_FOUND_RESPONSE = {
  status: HttpStatus.NOT_FOUND,
  description: NOT_FOUND_MESSAGE,
};

export const UNAUTHORIZED_RESPONSE = {
  status: HttpStatus.UNAUTHORIZED,
  description: UNAUTHORIZED_MESSAGE,
};
