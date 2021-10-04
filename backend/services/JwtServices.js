import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
class JwtServices {
    static sign(payload, expiry = '60s', secreat = JWT_SECRET) {
        return jwt.sign(payload, secreat, { expiresIn: expiry });
    }
    static verify(token, secreat = JWT_SECRET) {
        return jwt.verify(token, secreat);
    }
}

export default JwtServices;