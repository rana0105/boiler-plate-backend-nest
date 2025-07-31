import {
  IsOptional,
  IsArray,
  IsString,
} from 'class-validator';

export class RoleUpdateDto {
    @IsOptional()
    name: string;

    @IsOptional()
    @IsArray({ message: 'Permission must be an array' })
    @IsString({ each: true, message: 'Each pemission must be a string' })
    permissionNames?: string[];
}
