import ResponseHandler from '../utils/Response'
import { Request, Response } from 'express'
import { CustomerRepository } from '../repository'
import { getOptions } from '../utils/options'
import { encrypt } from '../utils/helper'
import jwt from 'jsonwebtoken'

/**
 * @description CustomerController
 *
 * @function createCustomer
 * @function getCustomer
 */
class CustomerController {
  constructor() {}
  async getCustomer(req: Request, res: Response) {
    const { email: username, password } = req.body
    const options = getOptions(req.headers, { username, password })
    const data = await new CustomerRepository(options).getCustomer(
      req.body,
      res.locals
    )

    if (data.statusCode == 200) {
      const user = {
        username,
        customerId: data.body?.customer?.id
      }
      // create jwt access token if successfully logged in
      data.body.accessToken = this.generateAccessToken(user);
      
      const customerBody = data.body.customer;
      const mappedCustomer = {
        id: customerBody.id,
        email: customerBody.email,
        firstName: customerBody.firstName
      }
      data.body.customer = mappedCustomer;
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

  async logoutCustomer(req: Request, res: Response) {
    // const { email: username, password } = req.body
    const options = getOptions(req.headers)
    const data = await new CustomerRepository(options).logoutCustomer()

    if (data == null) {
      return ResponseHandler.successResponse(res, 200, 'user logged out', data)
    }
    return ResponseHandler.errorResponse(
      res,
      data.statusCode || data.body.statusCode,
      data.message || data.body.message,
      data.body
    )
  }

  generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
  }
}

export default CustomerController
