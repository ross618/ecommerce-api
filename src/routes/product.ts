import { Router } from 'express'
import { ProductController } from '../controller'
import { ProductValidator } from '../middleware'

const productController = new ProductController()

const router = Router()
const { validateAddProduct, validateGetProduct, validateUpdateProduct, validateDeleteProduct } = ProductValidator
const { getProducts, getProductById, addProduct, updateProduct, deleteProductById } = productController

router.get('/products', getProducts.bind(productController))
router.get('/product', validateGetProduct, getProductById.bind(productController))
router.post('/product', validateAddProduct, addProduct.bind(productController))
router.put('/product', validateUpdateProduct, updateProduct.bind(productController))
router.delete('/product', validateDeleteProduct, deleteProductById.bind(productController))

export default router
