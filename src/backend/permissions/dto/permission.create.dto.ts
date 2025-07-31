import {
  IsNotEmpty,
} from 'class-validator';

export class PermissionCreateDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
