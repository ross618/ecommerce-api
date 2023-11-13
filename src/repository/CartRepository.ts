import Client from '../client/Client'
import { ApiRoot } from '@commercetools/platform-sdk'

interface ICart {
  apiRoot: ApiRoot
  projectKey: string
  createCartForCurrentCustomer(cartDraft: CartDraft): object
  getActiveCart(): object
}

type CartDraft = {
  currency: string
  customerEmail?: string
}

type MyCartUpdate = {
  version: number
  actions: Array<MyCartUpdateAction>
}

type MyCartUpdateAction = {
  readonly action: 'addLineItem'
  readonly productId?: string
  readonly variantId?: number
  readonly quantity?: number
}

type MyCartRemoveItem = {
  version: number
  actions: Array<MyCartRemoveLineItemAction>
}

type MyCartRemoveLineItemAction = {
  readonly action: 'removeLineItem'
  readonly lineItemId: string
  readonly quantity?: number
}

type CartUpdateDraft = {
  version: number
  productId: string
  variantId: number
  quantity: number
}

type CartRemoveItemDraft = {
  version: number
  lineItemId: string
  quantity: number
}

class CartRepository implements ICart {
  apiRoot: ApiRoot
  projectKey: string

  constructor(options) {
    const rootClient = new Client(options)
    this.apiRoot = rootClient.getApiRoot(
      rootClient.getClientFromOption(options)
    )
    this.projectKey = rootClient.getProjectKey()
  }

  private createCustomerCartDraft(cartData) {
    const { currency, customerEmail } = cartData

    return {
      currency,
      customerEmail,
    }
  }

  private createCartUpdateDraft(
    cartUpdateDraft: CartUpdateDraft
  ): MyCartUpdate {
    const action = 'addLineItem' // default value needed to tell the system we are adding an item to cart
    const { version, productId, quantity } = cartUpdateDraft
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
    }
  }

  private createRemoveItemDraft(
    cartRemoveItemDraft: CartRemoveItemDraft
  ): MyCartRemoveItem {
    const action = 'removeLineItem' // default value needed to tell the system we are removing an item from the cart
    const { version, lineItemId, quantity } = cartRemoveItemDraft
    return {
      version,
      actions: [
        {
          action,
          lineItemId,
          quantity,
        },
      ],
    }
  }

  async createCartForCurrentCustomer(cartDraft: CartDraft) {
    try {
      const cart = await this.getActiveCart()
      if (cart?.statusCode == 200) return cart
      return this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .post({
          body: this.createCustomerCartDraft(cartDraft),
        })
        .execute()
    } catch (error) {
      return error
    }
  }

  async getActiveCart() {
    try {
      const activeCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .activeCart()
        .get()
        .execute()

      return activeCart
    } catch (error) {
      return error
    }
  }

  private async getCartById(cartId) {
    try {
      const activeCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .withId({ ID: cartId })
        .get()
        .execute()

      return activeCart
    } catch (error) {
      return error
    }
  }

  async updateActiveCart(productDetails) {
    try {
      // if cartId is undefined create an anonymous cart
      if (!productDetails.cartId) {
        const { body } = await this.createCartForCurrentCustomer({
          currency: process.env.DEFAULT_CURRENCY,
        })
        productDetails.cartId = body.id
        productDetails.version = body.version
      } else {
        const { body } = await this.getActiveCart()
        productDetails.version = body.version
      }

      const updatedCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .withId({ ID: productDetails.cartId })
        .post({ body: this.createCartUpdateDraft(productDetails) })
        .execute()

      return updatedCart
    } catch (error) {
      return error
    }
  }

  async removeLineItem(productDetails) {
    try {
      const activeCart = await this.getActiveCart()
      // return data if not successful response
      if (activeCart.statusCode !== 200) {
        return activeCart;
      }
      productDetails.version = activeCart.body.version;
      const lineItems = activeCart.body.lineItems;
      // Find correct lineItem ID from productId
      const currentLineItem = lineItems.find((lineItem) => lineItem.productId === productDetails.productId);
      productDetails.lineItemId = currentLineItem.id;

      const updatedCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .withId({ ID: activeCart.body.id })
        .post({ body: this.createRemoveItemDraft(productDetails) })
        .execute()

      return updatedCart
    } catch (error) {
      return error
    }
  }
}

export default CartRepository