import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Auth } from "../auth.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('AUTH_REPOSITORY')
        private authRepository: typeof Auth,

        private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    async validate(payload: {
        sub: number,
        email: string
    }) {
        const auth = await this.authRepository.findByPk(payload.sub);
        delete auth.createdAt;
        delete auth.updatedAt;
        delete auth.password;
        return auth;
    }
}