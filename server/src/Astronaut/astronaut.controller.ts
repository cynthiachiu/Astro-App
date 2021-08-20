import { Controller, Get } from '@nestjs/common';
import { AstronautService } from './astronaut.service';

@Controller('astronaut')
export class AstronautController {
    constructor(private astronautService: AstronautService) { }

    @Get('get-astronauts')
    getAstronauts() {
        return this.astronautService.getAstronauts();
    }
}
