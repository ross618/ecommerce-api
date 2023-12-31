import { Request, Response } from 'express'
import ResponseHandler from '../utils/Response'
import { CartRepository } from '../repository'
import { getOptions } from '../utils/options'
import { encrypt } from '../utils/helper'

/**
 * @description CartController
 * @function getActiveCart
 */
class CartController {
  constructor() {}

  async createCartForCurrentCustomer(req: Request, res: Response) {
    const options = getOptions(req.headers)
    const data = await new CartRepository(options).createCartForCurrentCustomer(
      req.body
    )

    if (data.statusCode == 201 || data.statusCode == 200) {
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

  async getCartById(req: Request, res: Response) {
    const options = getOptions(req.headers)
    const data = await new CartRepository(options).getCartById(req.user)

    if (data.statusCode == 200) {
      return ResponseHandler.successResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message || data.body.message,
        data.body
      )
    }
    if (data.statusCode == 404) {
      data.message = 'No cart found, try logging in'
      return ResponseHandler.errorResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message,
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

  async updateActiveCart(req: Request, res: Response) {
    const options = getOptions(req.headers)
    const data = await new CartRepository(options).updateActiveCart(req.user, req.body)
    if (data.statusCode == 200) {
      // data.body.token = encrypt(req.headers.token)
      data.body.token = data.body?.anonymousId || data.body?.customerId || null
      data.message = 'Cart updated'
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

  async removeLineItem(req: Request, res: Response) {
    const options = getOptions(req.headers) // get the actual option
    const data = await new CartRepository(options).removeLineItem(req.user, req.body)

    if (data.statusCode == 200) {
      return ResponseHandler.successResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message || data.body.message,
        data.body
      )
    }
    if (data.statusCode == 404) {
      data.message = 'No cart found, try logging in'
      return ResponseHandler.errorResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message,
        data.body
      )
    }
    if (data.statusCode == 422) {
      data.message = `Product with id ${req.body.productId} is not in current cart`;
      return ResponseHandler.errorResponse(
        res,
        data.statusCode || data.body.statusCode,
        data.message,
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

export default CartController
