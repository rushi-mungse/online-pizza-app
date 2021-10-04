import multer from 'multer'
import path from 'path'
import CustomErrorHanler from '../services/CustomErrorHandler'
import { Products } from '../models'
import fs from 'fs'
import Joi from 'joi'

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

const handleMultipartData = multer({ storage, limits: { filesize: 1000000 * 5 } }).single('image');

const productController = {

    async store(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHanler.serverError(err.message));
            }
            const filePath = req.file.path.replace('\\','/');

            // console.log(req.file);
            // console.log(`${appRoot}/${filePath}`);
            // console.log(filePath);

            const productsSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(),
                image: Joi.string()

            });
            const { error } = productsSchema.validate(req.body);

            if (error) {
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorHanler.serverError());
                    }
                })
                return next(error);
            }
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Products.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
            } catch (error) {
                return next(error);
            }
            res.status(201).json(document);
        })
    },
    update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHanler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }

            const productsSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(),
                image: Joi.string()

            });
            const { error } = productsSchema.validate(req.body);
            if (req.file) {

                if (error) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(CustomErrorHanler.serverError());
                        }
                    })
                    return next(error);
                }
            }
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Products.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath })
                }, { new: true })
            } catch (error) {
                return next(error);
            }
            res.status(201).json(document);
        }
        ) 
    },
    async destroy(req, res, next) {
        const document = await Products.findOneAndRemove({ _id: req.params.id })
        if (!document) {
            return next(new Error('Nothing to delete!'))
        }
        const imgPath = document._doc.image;
        console.log(imgPath);
        fs.unlink(`${appRoot}/${imgPath}`, (err) => {
            if (err) {
                return next(CustomErrorHanler.serverError());
            }
        })
        res.json(document);
    },
    async index(req, res, next) {
        let documents;
        try {
            documents = await Products.find().select('-updatedAt -__v').sort({ _id: -1 });
        } catch (error) {
            return next(CustomErrorHanler.serverError())
        }
        res.json(documents);
    },
    async show(req,res,next){
        let document;
        try {
            document=await Products.findOne({_id:req.params.id}).select('-updateAt -__v');

        } catch (error) {
            return next(CustomErrorHanler.serverError());
        }
        res.json(document)
    }
}


export default productController;