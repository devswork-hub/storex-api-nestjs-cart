import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { FirebaseService } from "./firebase.service";

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) { }

  @Post('create/:collection')
  async create(
    @Param('collection') collection: string,
    @Body() body: any
  ) {
    return this.firebaseService.create(collection, body);
  }

  @Get('read/:collection/:id')
  async read(
    @Param('collection') collection: string,
    @Param('id') id: string
  ) {
    return this.firebaseService.readRecord(collection, id);
  }

  @Put('update/:collection/:id')
  async update(
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.firebaseService.updateRecord(collection, id, body)
  }

  @Delete('delete/:collection/:id')
  async delete(
    @Param('collection') collection: string,
    @Param('id') id: string
  ) {
    return this.firebaseService.deleteRecord(collection, id)
  }
}