import Client from '../client/Client'
import { ApiRoot, ProductSetDescriptionAction, ProductChangeNameAction } from '@commercetools/platform-sdk'

interface IProductRepository {
  apiRoot: ApiRoot
  projectKey: string
  getProducts(): any | Error
  getProductById(productId): any | Error
  addProduct(productData): any | Error
  updateProduct(productData): any | Error
  deleteProductById(productId): any | Error
}

type UnpublishAction = {
  version: number
  actions: Array<{readonly action: 'unpublish'}>
}

class Product implements IProductRepository {
  apiRoot: ApiRoot
  projectKey: string
  constructor(options) {
    const rootClient = new Client(options)
    this.apiRoot = rootClient.getApiRoot(
      rootClient.getClientFromOption(options)
    )
    this.projectKey = rootClient.getProjectKey()
  }

  createProductDraft(productData) {
    const { productTypeID, slug, name, description, sku, price } = productData;
    const typeId: 'product-type' = 'product-type';


    return {
      name: {
        "en-GB": name
      },
      productType: {
        typeId,
        id: productTypeID,
      },
      description: {
        "en-GB": description
      },
      slug : {
        "en-GB": slug
      },
      masterVariant: {
        sku,
        prices: [{
          value: {
            currencyCode: "EUR",
            centAmount: price
          }
        }]
      },
      publish: true
    }
  }

  createProductUpdateDraft(productData) {
    const { version, name, description, price } = productData;
    const actions = [];
    if (name) {
      const changeNameAction = {
        action: "changeName",
        name: {
          "en-GB" : name
        }
      };
      actions.push(changeNameAction);
    }
    if (description) {
      const setDescriptionAction = {
        action: "setDescription",
        description: {
          "en-GB": description
        }
      };
      actions.push(setDescriptionAction);
    }
    if (price) {
      const changePriceAction = {
        action: "changePrice",
        priceId: productData.priceId,
        price : {
          value : {
            currencyCode: "EUR",
            centAmount: price
          }
        },
        published : true
      }
      actions.push(changePriceAction);
    }
    // const action: ProductSetDescriptionAction = {
    //   action: "setDescription",
    //   description : {
    //     "en-GB" : description
    //   }
    // };

    // const action: ProductChangeNameAction = {
    //   action: "changeName",
    //   name
    // };
    
    return {
      version,
      actions
    }
  }

  unpublishProductDraft(version): UnpublishAction {
    return {
      version,
      actions: [{
        action: "unpublish"
      }]
    }
  }

  async getProducts() {
    try {
      const products = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .products()
        .get()
        .execute()

      return products
    } catch (error) {
      return error
    }
  }

  async getProductById(productId) {
    try {
      const product = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .products()
        .withId({ ID: productId })
        .get()
        .execute()

      return product
    } catch (error) {
      return error
    }
  }

  async addProduct(productData) {
    try {
      // Create new product
      const product = await this.apiRoot
          .withProjectKey({ projectKey: this.projectKey })
          .products()
          .post({
            body: this.createProductDraft(productData),
          })
          .execute();

          return product
    } catch (error) {
      return error
    }
  }

  async updateProduct(productData) {
    try {
      // Update product with productId
      const currentProduct = await this.getProductById(productData.productId);
      productData.version = currentProduct?.body?.version;
      productData.priceId = currentProduct?.body?.masterData?.current?.masterVariant?.prices[0]?.id;
      // console.log(currentProduct);
      const product = await this.apiRoot
          .withProjectKey({ projectKey: this.projectKey })
          .products()
          .withId({ ID: productData.productId })
          .post({
            body: this.createProductUpdateDraft(productData),
          })
          .execute();

          return product
    } catch (error) {
      return error
    }
  }

  async deleteProductById(productId) {
    try {
      const currentProduct = await this.getProductById(productId);
      const unpublishedProduct = await this.unpublishProduct(currentProduct);
      // const product = await this.apiRoot
      //     .withProjectKey({ projectKey: this.projectKey })
      //     .products()
      //     .withId({ ID: productId })
      //     .post({
      //       body: this.unpublishProductDraft(unpublishedProduct?.body?.version),
      //     })
      //     .execute();

      const deleteProduct = await this.apiRoot
          .withProjectKey({ projectKey: this.projectKey })
          .products()
          .withId({ ID: productId })
          .delete({
            queryArgs: {
              version: unpublishedProduct?.body?.version
            }
          })
          .execute()
          return deleteProduct
    } catch (error) {
      return error
    }
  }

  private async unpublishProduct(productData) {
    try {
      const product = await this.apiRoot
          .withProjectKey({ projectKey: this.projectKey })
          .products()
          .withId({ ID: productData.body.id })
          .post({
            body: this.unpublishProductDraft(productData.body.version),
          })
          .execute();

          return product
    } catch (error) {
      return error
    }
  }
}

export default Product
