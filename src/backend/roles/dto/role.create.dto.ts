import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsString,
} from 'class-validator';

export class RoleCreateDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsOptional()
  @IsArray({ message: 'Permission must be an array' })
  @IsString({ each: true, message: 'Each pemission must be a string' })
  permissionNames?: string[];
}
