import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchQueryDto } from './dto/search-query.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../user/schemas/user.schema';

@ApiTags('search')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query() searchQueryDto: SearchQueryDto, @GetUser() user: User) {
    return this.searchService.findAll(searchQueryDto, user._id);
  }
}
