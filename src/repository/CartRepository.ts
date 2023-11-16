import CommercetoolsClient from '../commerctools/Client';
import { ApiRoot } from '@commercetools/platform-sdk';
import {
  CartDraft,
  MyCartUpdate,
  CartUpdateDraft,
  MyCartRemoveItem,
  CartRemoveItemDraft,
} from '../types/cart';

interface ICart {
  apiRoot: ApiRoot;
  projectKey: string;
  createCartForCurrentCustomer(user, cartDraft: CartDraft): object;
  getActiveCart(user): object;
}

class CartRepository implements ICart {
  apiRoot: ApiRoot;
  projectKey: string;

  constructor(options) {
    const rootClient = new CommercetoolsClient(options);
    this.apiRoot = rootClient.getApiRoot(
      rootClient.getClientFromOption(options)
    );
    this.projectKey = rootClient.getProjectKey();
  }

  private createCustomerCartDraft(cartData) {
    const { currency, customerEmail } = cartData;

    return {
      currency,
      customerEmail,
    };
  }

  private createCartUpdateDraft(
    cartUpdateDraft: CartUpdateDraft
  ): MyCartUpdate {
    const action = 'addLineItem';
    const { version, productId, quantity } = cartUpdateDraft;
    return {
      version,
      actions: [
        {
          action,
          productId,
          variantId: 1, // use master variant
          quantity,
        },
      ],
    };
  }

  private createRemoveItemDraft(
    cartRemoveItemDraft: CartRemoveItemDraft
  ): MyCartRemoveItem {
    const action = 'removeLineItem';
    const { version, lineItemId, quantity } = cartRemoveItemDraft;
    return {
      version,
      actions: [
        {
          action,
          lineItemId,
          quantity,
        },
      ],
    };
  }

  async createCartForCurrentCustomer(cartDraft: CartDraft) {
    try {
      const cart = await this.getActiveCart();
      if (cart?.statusCode == 200) return cart;
      return this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .post({
          body: this.createCustomerCartDraft(cartDraft),
        })
        .execute();
    } catch (error) {
      return error;
    }
  }

  async getActiveCart() {
    try {
      const activeCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .activeCart()
        .get()
        .execute();

      return activeCart;
    } catch (error) {
      return error;
    }
  }

  async getCartById(user) {
    try {
      const activeCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .withId({ ID: user.cartId })
        .get()
        .execute();

      return activeCart;
    } catch (error) {
      return error;
    }
  }

  async updateActiveCart(user, productDetails) {
    try {
      // if cartId is undefined create an anonymous cart
      if (!user.cartId) {
        const { body } = await this.createCartForCurrentCustomer({
          currency: process.env.DEFAULT_CURRENCY,
        });
        productDetails.cartId = body.id;
        productDetails.version = body.version;
      } else {
        const { body } = await this.getCartById(user);
        productDetails.cartId = body.id;
        productDetails.version = body.version;
      }

      const updatedCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .withId({ ID: productDetails.cartId })
        .post({ body: this.createCartUpdateDraft(productDetails) })
        .execute();

      return updatedCart;
    } catch (error) {
      return error;
    }
  }

  async removeLineItem(user, productDetails) {
    try {
      const activeCart = await this.getCartById(user);
      // return activeCart response if not successful
      if (activeCart.statusCode !== 200) {
        return activeCart;
      }
      productDetails.version = activeCart.body.version;
      const lineItems = activeCart.body.lineItems;
      // Find correct lineItem ID from productId
      const currentLineItem = lineItems.find(
        (lineItem) => lineItem.productId === productDetails.productId
      );

      if (currentLineItem?.id) {
        productDetails.lineItemId = currentLineItem?.id;
      } else {
        // return 422 code if lineItemId is undefined
        activeCart.statusCode = 422;
        return activeCart;
      }

      const updatedCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .withId({ ID: activeCart.body.id })
        .post({ body: this.createRemoveItemDraft(productDetails) })
        .execute();

      return updatedCart;
    } catch (error) {
      return error;
    }
  }
}

export default CartRepository;
