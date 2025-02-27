import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

}
