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
    const user = {username, password}
    const options = getOptions(req.headers, { username, password })
    const data = await new CustomerRepository(options).getCustomer(
      req.body,
      res.locals
    )

    if (data.statusCode == 200) {
      // create jwt access token if successfully logged in
      data.body.token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h'});
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
    const { email: username, password } = req.body
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
}

export default CustomerController
