import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtServices from "../../services/jwtServices";
const refreshController={
 async refresh(req,res,next){
   
    const refreshSchema=Joi.object({
        refresh_token:Joi.string().required()
    })

    const {error}=refreshSchema.validate();
    if(error){
        return next(error);
    }
    let refreshToken;
    try {
        refreshToken=await RefreshToken.findOne({refresh_token:req.body.refresh_token});
        if(!refreshToken){
            return next(CustomErrorHandler.unAuthorized("Invalid refresh token!"))
        }

        let userId;
        try {
            const {_id}= await JwtServices.verify(req.body.refresh_token,REFRESH_SECRET);
            userId=_id;
        } catch (error) {
            return next(error);
        }

        const user=await User.findOne({_id:userId})
        if(!user){
            return next(CustomErrorHandler.unAuthorized('User not found!'));
        }
         
        const access_token=await JwtServices.sign({_id:user._id,role:user.role});
        const refresh_token=await JwtServices.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET);
        
        await RefreshToken.create({refresh_token})

        res.json({access_token,refresh_token});


    } catch (error) {
        return next(new Error("somthing went wrong!"))
    }


 }   
}

export default refreshController;