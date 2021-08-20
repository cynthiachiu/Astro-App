import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class AstronautService {
    constructor(private httpService: HttpService) { }

    getAstronauts() {
        let response = this.httpService.get('http://api.open-notify.org/astros.json').pipe(
            map(resp => resp.data),
        );

        return response;
    }
}
