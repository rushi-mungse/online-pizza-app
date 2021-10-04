import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtServices from '../services/JwtServices'

const auth=async (req,res,next)=>{
    let authHeader=req.headers.authorization;
    
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized());
    }
    
    const token=authHeader.split(' ')[1];

    try{
        const {_id,role}=await JwtServices.verify(token);
        const user={
            _id,
            role
        }
        req.user=user;
        next();
        if(!user){
            return next(CustomErrorHandler.userNotFound());
        }
    }catch(err){
        return next(err);
    }
}

export default auth;