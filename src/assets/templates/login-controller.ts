import { NextFunction, Request, Response } from 'express';
import { /*table*/ } from '../interfaces//*table*/.interface';
import { logger, stream } from '@utils/logger';
import config from 'config';
import jsonwebtoken, { JsonWebTokenError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { HttpException } from '@exceptions/HttpException';
import /*table*/LoginService from '@/services/login';
import { log } from 'console';
class LoginController {
    public /*tableLower*/Service = new /*table*/LoginService();
    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const login = req.header('login');
            const password = req.header('password');
            if (login === undefined || password === undefined) {
                logger.warn(`Login bad header from ip: ${req.ip}`);
                return next(new HttpException(401,'Unauthorized'));
            }
            const /*tableLower*/:/*table*/= await this./*tableLower*/Service.find(login);
            if (/*tableLower*/./*count*/=== -1) {
                logger.warn(`Login error user disabled`);
                return next(new HttpException(401,'Unauthorized'));
            }
            if (await bcrypt.compare(password, /*tableLower*/./*password*/)) {
                const date: Date = new Date();
                const jwt = jsonwebtoken.sign({ login: /*tableLower*/./*login*/, date: date.toString() }, config.get('secretKey'), { expiresIn: '30d' });
                /*tableLower*/./*bearer*/=/*tableLower*/./*bearer*/+jwt;
                await this./*tableLower*/Service.patchCount(/*tableLower*/.id, 0);
                await this./*tableLower*/Service.patchBearer(/*tableLower*/.id, /*tableLower*/./*bearer*/);
                res.status(200).json({ data: jwt, message: 'Logged' });
            } else {
                let count = 0
                if (/*tableLower*/./*count*/ > 5) {
                    count - 1
                } else {
                    count =/*tableLower*/./*count*/++;
                    await this./*tableLower*/Service.patchCount(/*tableLower*/.id, count)
                }
                logger.warn(`Login error from ip:${req.ip},user:${login}`);
                return next(new HttpException(401,'Unauthorized'));
            }
        } catch (error) {
            next(error);
        }
    };
    public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.headers.authorization === undefined) {
                logger.warn(`Logout error from ip ${req.ip}`);
                return next(new HttpException(401,'Unauthorized'));
            } else {
                const bearer = req.headers.authorization.split(' ').pop();
                let  payload=null;
                try {
                    payload=jsonwebtoken.decode(bearer, { json: true }); 
                } catch (error) {
                    next(error);
                }
                if (payload === null || payload.login === undefined) {
                    logger.warn(`Logout error from ip ${req.ip}`);
                    return next(new HttpException(401,'Unauthorized'));
                }
                const /*tableLower*/:/*table*/= await this./*tableLower*/Service.find(payload.login);
                if (/*tableLower*/===undefined){
                    return next(new HttpException(401,'Unauthorized'));
                }
                if (/*tableLower*/./*bearer*/.search(bearer) !== -1) {
                    await this./*tableLower*/Service.patchCount(/*tableLower*/.id, 0);
                    const newBearer =/*tableLower*/./*bearer*/.replace(bearer, '');
                    await this./*tableLower*/Service.patchBearer(/*tableLower*/.id, newBearer);
                    res.status(200).json({ data: new Date().toString(), message: 'Logout' });
                } else {
                    logger.warn(`Logout error from ip:${req.ip},user:${payload./*login*/}`);
                    return next(new HttpException(401,'Unauthorized'));
                }
            }
        } catch (error) {
            next(error);
        }
    }
}
export default LoginController