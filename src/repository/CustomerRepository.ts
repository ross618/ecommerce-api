import Client from '../client/Client';
import { ApiRoot } from '@commercetools/platform-sdk';

type ICustomerOptions = {
  anonymousId?: object;
};
interface ICustomerRepository {
  apiRoot: ApiRoot;
  projectKey: string;
  getCustomer(
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    options: ICustomerOptions
  ): any | never;
}

class CustomerRepository implements ICustomerRepository {
  apiRoot: ApiRoot;
  projectKey: string;
  constructor(options) {
    const rootClient = new Client(options);
    this.apiRoot = rootClient.getApiRoot(
      rootClient.getClientFromOption(options)
    );
    this.projectKey = rootClient.getProjectKey();
  }

  async getCustomer({ email, password }, options) {
    try {
      const customer = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .login()
        .post({
          body: {
            email,
            password,
            updateProductData: true,
            activeCartSignInMode: 'MergeWithExistingCustomerCart',
          },
        })
        .execute();

      return customer;
    } catch (error) {
      return error;
    }
  }

  async logoutCustomer() {
    try {
      return null;
    } catch (error) {
      return error;
    }
  }
}

export default CustomerRepository;
