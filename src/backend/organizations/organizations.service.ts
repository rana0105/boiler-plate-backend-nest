import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/organization.dto';
import { UpdateOrganizationDto } from './dto/organization.update.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
  ) {}

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    const organization = this.orgRepository.create(dto);
    return await this.orgRepository.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return await this.orgRepository.find();
  }

  async findOne(id: number): Promise<Organization> {
    const organization = await this.orgRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async update(id: number, dto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findOne(id);
    const updated = this.orgRepository.merge(organization, dto);
    return await this.orgRepository.save(updated);
  }

  async delete(id: number): Promise<void> {
    const organization = await this.findOne(id);
    await this.orgRepository.remove(organization);
  }
}
