import jwt from 'jsonwebtoken'

/**
 *
 * @class Validation
 * @description class to handle request validations
 *
 * @method authenticate
 */
class Auth {
  /**
   *
   * @description authenticate via JWT
   *
   * @param {object} request
   * @param {object} response
   * @param {function} next
   *
   * @returns {object} http response object
   */
  static authenticate = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      return response.status(401).send('Unauthorized access');
    }
    try {
      const user = {};
      const decoded = jwt.decode(token, { complete: true });
      // console.log(decoded);
      jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET), (error, user) => {
        if (error) return response.status(403).send(error);
        // request.user = user;
        // request.locals.user = user;
        // console.log(user)
      };
      request.user = decoded.payload;
    }
    catch (error) {
      return response.status(403).send('Invalid token');
    }
    next()
  }
}

export default Auth
