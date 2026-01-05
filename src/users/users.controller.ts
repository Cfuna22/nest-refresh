import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body() body: { email: string; name: string }) {
        return this.usersService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateData: Partial<{email: string; name: string}>){
        return this.usersService.update(id, updateData);
    }
}
