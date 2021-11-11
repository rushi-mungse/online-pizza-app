import Joi from 'joi';
import { RefreshToken, User } from '../../models';
import {REFRESH_SECRET} from '../../config'
import CustomErrorHandler from '../../services/CustomErrorHandler';
import bcrypt from 'bcrypt'
import JwtServices from '../../services/jwtServices';
const registerController = {

    async register(req, res, next) {

        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password') 
        })
        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alredyExist("This email already taken."))
            }
        } catch (error) {
            return next(error)
        }

        const { name, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashPassword
        })
        let jwt_accessToken;
        let jwt_refreshToken;
        try {
            const result = await user.save();
            jwt_accessToken = await JwtServices.sign({ _id: result._id, role: result.role });
            jwt_refreshToken = await JwtServices.sign({ _id: result._id, role: result.role },'1y',REFRESH_SECRET);
            await RefreshToken.create({refresh_token:jwt_refreshToken});
        } catch (err) {
            return next(err);
        }

        res.json({ access_token: jwt_accessToken,refresh_token:jwt_refreshToken });
    }
}
export default registerController