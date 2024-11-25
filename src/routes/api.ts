import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import rbacMiddleware from '../middlewares/rbac.middleware';
import authController from '../controllers/auth.controller';
import categoryController from '../controllers/category.controller';
import productController from '../controllers/product.controller';
import orderController from '../controllers/order.controller';

const router = express.Router();

const adminOnly = [authMiddleware, rbacMiddleware(['admin'])];

// Auth
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/me', authMiddleware, authController.me);
router.put('/auth/update-profile', authMiddleware, authController.updateProfile);

// Categories
router.get('/categories', authMiddleware, categoryController.findAll);
router.post('/categories', adminOnly, categoryController.create);
router.get('/categories/:id', authMiddleware, categoryController.findOne);
router.put('/categories/:id', adminOnly, categoryController.update);
router.delete('/categories/:id', adminOnly, categoryController.delete);

// Products
router.get('/products', authMiddleware, productController.findAll);
router.post('/products', adminOnly, productController.create);
router.get('/products/:id', authMiddleware, productController.findOne);
router.put('/products/:id', adminOnly, productController.update);
router.delete('/products/:id', adminOnly, productController.delete);

// Orders
router.post('/orders', authMiddleware, orderController.create);
router.get('/orders', authMiddleware, orderController.findAll);

export default router;
