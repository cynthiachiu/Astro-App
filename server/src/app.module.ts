import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AstronautService } from './Astronaut/astronaut.service';
import { AstronautController } from './Astronaut/astronaut.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    HttpModule,
    // go to localhost:3000/index to see the page
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
  ],
  controllers: [AppController, AstronautController],
  providers: [AppService, AstronautService],
})
export class AppModule { }
