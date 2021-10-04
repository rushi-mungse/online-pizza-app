import express from 'express'
import { registerController, loginController,userController,refreshController,productController } from '../controllers'
import auth from '../middlewares/auth';
const router = express.Router();
import admin from '../middlewares/admin'


router.post('/api/register', registerController.register);
router.post('/api/login', loginController.login);
router.get('/api/me',auth, userController.me);
router.post('/api/refresh', refreshController.refresh);
router.post('/api/logout',auth, loginController.logout);

router.post('/api/products',[auth,admin], productController.store);
router.put('/api/products/:id',[auth,admin], productController.update);
router.delete('/api/products/:id',[auth,admin], productController.destroy);
router.get('/api/products', productController.index);
router.get('/api/products/:id', productController.show);

export default router