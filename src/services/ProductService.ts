import { ProductRepository } from '../repository'

interface IProductService {
  productRepository: typeof ProductRepository
  getProducts(): any
  getProductById(productId): any
  addProduct(productData): any
  updateProduct(productData): any
  deleteProductById(productId): any
}
/**
 * @description product service class
 */
class ProductService implements IProductService {
  productRepository: any
  constructor(productRepository) {
    this.productRepository = productRepository
  }

  getProducts() {
    return this.productRepository.getProducts()
  }
  getProductById(productId) {
    return this.productRepository.getProductById(productId)
  }
  addProduct(productData) {
    return this.productRepository.addProduct(productData)
  }
  updateProduct(productData) {
    return this.productRepository.updateProduct(productData)
  }
  deleteProductById(productId) {
    return this.productRepository.deleteProductById(productId)
  }
}

export default ProductService
