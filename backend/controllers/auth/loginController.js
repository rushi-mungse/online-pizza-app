import Joi from 'joi'
import { User,RefreshToken } from '../../models';
import bcrypt from 'bcrypt';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtServices from '../../services/jwtServices';
import { REFRESH_SECRET } from '../../config';

const loginController = {
    async login(req, res, next) {
        //logic
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });
        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        } 

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) return next(CustomErrorHandler.wrongCredentials());

            const access_token = await JwtServices.sign({ _id: user._id, role: user.role });
            const refresh_token = await JwtServices.sign({ _id: user._id, role: user.role },'1y',REFRESH_SECRET);
            await RefreshToken.create({refresh_token:refresh_token});
            res.json({ access_token,refresh_token });

        } catch (error) {
            return next(error)
        }

    },

    async logout(req,res,next){
        const logoutSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });
        const { error } = logoutSchema.validate(req.body);

        if (error) {
            return next(error);
        } 
        try {
            await RefreshToken.deleteOne({refresh_token:req.body.refresh_token});
        } catch (error) {
            return next(new Error("Something went wrong in the database!"));
        }
        res.json({status:1});
    }
}

export default loginController