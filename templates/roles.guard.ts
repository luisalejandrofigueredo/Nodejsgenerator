import { Injectable, Inject, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Logger } from 'winston';
import { /*table*/Service } from '../service//*table*/.service';
import { /*table*/ } from '../entitys//*table*/.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject('winston') private readonly logger: Logger, private reflector: Reflector, private userservice:/*table*/Service, private readonly jwtService: JwtService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();
    const ip = request.ip;
    let token='';
    let /*tablelower*/:/*table*/;
    if (request.headers.authorization === undefined) {
      const date = new Date();
      console.log(request.headers);
      this.logger.warn(`Ataque hacker desde la ip ${ip} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
      return false;
    }
    if (request.headers.authorization.startsWith("Bearer ")) {
      token = request.headers.authorization.substring(7, request.headers.authorization.length);
    } else {
      const date = new Date();
      this.logger.warn(`Bearer error desde la ip ${ip} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
      return false;
    }
    const username = this.jwtService.decode(token as string) as { login: string | null } | null;
    if (username === null || username === undefined) { this.logger.warn('hacker'); return false; };
    await this.userservice.getlogin(username.login).then(usuario => /*tablelower*/ = usuario);
    if (/*tablelower*/ === undefined || /*tablelower*/ === null) {
      this.logger.warn(`Usuario indefinido hacker ip:${ip}`);
      return false
    };
    if (this.autroles(roles, /*tablelower*/./*roles*/) === false) {
      this.logger.warn(`Intento de acceso sin privilegios de: ${/*tablelower*/./*login*/}`);
      this.logger.warn(`desde la ip ${ip} a la api ${request.url} metodo ${request.method}`);
      return false;
    };
    if (/*tablelower*/./*bearertoken*/ === token) {
      return true;
    } else {
      const date = new Date();
      this.logger.warn(`No logeado token falso hacker desde ip: ${ip} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
      return false
    }
  }
  // Me fijo si tiene autorizacion por roles
  autroles(roles: string[], rolessuser: string): boolean {
    const arolesuser: string[] = rolessuser.split(' ');
    let find = false;
    arolesuser.forEach(element => {
      if (roles.find(elementa => elementa === element)) {
        find = true;
      }
    });
    return find;
  }
}
