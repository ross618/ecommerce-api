import ResponseHandler from '../utils/Response'
import { Request, Response } from 'express'
import { ProductRepository } from '../repository'
import { getOptions } from '../utils/options'

/**
 * @description ProductController
 *
 * @function registerUser
 */
class ProductController {
  constructor() {}

  async getProducts(req: Request, res: Response) {
    const options = getOptions(req.headers)
    const data = await new ProductRepository(options).getProducts()

    if (data.statusCode == 200) {
      return ResponseHandler.successResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message || data.body.message,
        data.body
      )
    }
    return ResponseHandler.errorResponse(
      res,
      data.statusCode || data.body.statusCode,
      data.message || data.body.message,
      data.body
    )
  }

  async getProductById(req: Request, res: Response) {
    const options = getOptions(req.headers)
    const data = await new ProductRepository(options).getProductById(req.body.productId)

    if (data.statusCode == 200) {
      return ResponseHandler.successResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message || data.body.message,
        data.body
      )
    }
    return ResponseHandler.errorResponse(
      res,
      data.statusCode || data.body.statusCode,
      data.message || data.body.message,
      data.body
    )
  }

  async addProduct(req: Request, res: Response) {
    const options = getOptions(req.headers)
    const data = await new ProductRepository(options).addProduct(req.body)

    if (data.statusCode == 201) {
      return ResponseHandler.successResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message || data.body.message,
        data.body
      )
    }
    return ResponseHandler.errorResponse(
      res,
      data.statusCode || data.body.statusCode,
      data.message || data.body.message,
      data.body
    )
  }

  async updateProduct(req: Request, res: Response) {
    const options = getOptions(req.headers)
    const data = await new ProductRepository(options).updateProduct(req.body)

    if (data.statusCode == 200) {
      return ResponseHandler.successResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message || data.body.message,
        data.body
      )
    }
    return ResponseHandler.errorResponse(
      res,
      data.statusCode || data.body.statusCode,
      data.message || data.body.message,
      data.body
    )
  }

  async deleteProductById(req: Request, res: Response) {
    const options = getOptions(req.headers)
    const data = await new ProductRepository(options).deleteProductById(req.body.productId)

    if (data.statusCode == 200) {
      return ResponseHandler.successResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message || data.body.message,
        data.body
      )
    }
    return ResponseHandler.errorResponse(
      res,
      data.statusCode || data.body.statusCode,
      data.message || data.body.message,
      data.body
    )
  }
}

export default ProductController
