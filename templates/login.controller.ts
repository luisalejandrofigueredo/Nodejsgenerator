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
    async login(@Ip() ip,@Headers('login') login:string,@Headers('password') password:string) {    
        const /*tablelower*/:/*table*/ = (await this.userservice.getlogin(login));
        if (/*tablelower*/ === undefined || /*tablelower*/ === null) {
            const date = new Date(Date.now());
            this.logger.warn(`hacker from ip:${ip} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
            return { mensaje:'no login'}
        };
        if (bcrypt.compareSync(password, /*tablelower*/./*password*/)) {
            /*tablelower*/./*bearertoken*/ = this.jwtService.sign({ login: login, ip:ip });
            await this.userservice.update(/*tablelower*/);
            const date = new Date();
            this.logger.info(`Login: ${/*tablelower*/./*login*/} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
            return { mensaje:'ok',token: /*tablelower*/./*bearertoken*/ };
        } else {
            this.logger.warn(`wrong password ${/*tablelower*/./*login*/}`)
            return { mensaje:'no login'}};
    }
    @Get()
    async logout(@Ip() ip,@Headers() header) {
        const /*tablelower*/: /*table*/  = (await this.userservice.getlogin(header.login));
        const date = new Date(Date.now());
        const hour= date.toLocaleTimeString();
        if (/*tablelower*/ === undefined || /*tablelower*/ === null) {
            this.logger.warn(`undefined user unexist user :${date} ${hour}`);
            return { mensaje:'error'};
        }
        if (/*tablelower*/./*bearertoken*/ !== header.token) {
            console.log(header.token);
            console.log(/*tablelower*/./*bearertoken*/);
            this.logger.warn(`hacker false bearer token from  ip ${ip} ${date} ${hour}`);
            return { mensaje:'error'}
        }
        /*tablelower*/./*bearertoken*/ = '';
        await this.userservice.update(/*tablelower*/);
        this.logger.info(`logout: ${/*tablelower*/./*login*/} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
        return { mensaje:'logout'};
    }
}
