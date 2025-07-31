import {
  IsOptional,
} from 'class-validator';

export class PermissionUpdateDto {
    @IsOptional()
    name: string;
}
