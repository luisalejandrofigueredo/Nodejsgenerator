import { Controller, Inject, Get, Headers, Post, Ip } from '@nestjs/common';
import { /*table*/Service } from '../service//*tablelower*/.service';
import { /*table*/ } from '../entitys//*tablelower*/.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';

@Controller('login')
export class LoginController {
    constructor(@Inject('winston') private readonly logger: Logger, private userservice: /*table*/Service, private readonly jwtService: JwtService) { }
    @Post()
    async login(@Ip() ip,@Headers() header) {
        this.logger.info('login:',header.login);
        const /*tablelower*/:/*table*/ = (await this.userservice.getlogin(header.login));
        if (/*tablelower*/ === undefined || /*tablelower*/ === null) {
            const date = new Date(Date.now());
            this.logger.warn(`Posible intento de hackeo intento de login con usuario inexistente ip:${ip} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
            return { mensaje:'no login'}
        };
        if (bcrypt.compareSync(header.password, /*tablelower*/./*password*/)) {
            /*tablelower*/./*bearertoken*/ = this.jwtService.sign({ login: header.login });
            await this.userservice.update(/*tablelower*/);
            const date = new Date();
            this.logger.info(`Login: ${/*tablelower*/./*login*/} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
            return { mensaje:'ok',token: /*tablelower*/./*bearertoken*/ };
        } else {
            this.logger.warn(`contraseña equivocada de ${/*tablelower*/./*login*/}`)
            return { mensaje:'no login'}};
    }
    @Get()
    async logout(@Ip() ip,@Headers() header) {
        const /*tablelower*/: /*table*/  = (await this.userservice.getlogin(header.login));
        const date = new Date(Date.now());
        const locdate= date.toLocaleDateString();
        const hour= date.toLocaleTimeString();
        if (/*tablelower*/ === undefined || /*tablelower*/ === null) {
            this.logger.warn(`Posible ataque hacker en logout usuario inexistente:${date} ${hour}`);
            return { mensaje:'error'};
        }
        if (/*tablelower*/./*bearertoken*/ !== header.token) {
            this.logger.warn(`Posible ataque hacker en logout intento de falsificación de token de ip ${ip} ${date} ${hour}`);
            return { mensaje:'error'}
        }
        /*tablelower*/./*bearertoken*/ = '';
        await this.userservice.update(/*tablelower*/);
        this.logger.info(`logout: ${/*tablelower*/./*login*/} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
        return { mensaje:'logout'};
    }
}
