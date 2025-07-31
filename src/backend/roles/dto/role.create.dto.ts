import {
  IsNotEmpty,
} from 'class-validator';

export class RoleCreateDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
