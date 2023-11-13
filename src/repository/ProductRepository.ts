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
    const rootClient = new Client(options);
    this.apiRoot = rootClient.getApiRoot(
      rootClient.getClientFromOption(options)
    );
    this.projectKey = rootClient.getProjectKey();
  }

  createProductDraft(productData) {
    const { productTypeID, slug, name, description, sku, price } = productData;
    const productTypeId: 'product-type' = 'product-type';
    const taxTypeId: 'tax-category' = 'tax-category';


    return {
      name: {
        "en-GB": name
      },
      productType: {
        typeId: productTypeId,
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
      taxCategory: {
        typeId: taxTypeId,
        id: "cbae3370-a392-4a53-ad15-10eabe88867e"
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
        }
      }
      actions.push(changePriceAction);
    }

    if (actions.length) {
      actions.push({ action: "publish" });
    }
    
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
      if (productData.quantityOnStock) {
        await this.setStockQuantity(productData);
      }
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
      if (productData.quantityOnStock) {
        productData.inventoryId = currentProduct?.body?.masterData?.current?.masterVariant?.availability?.id;
        productData.inventoryVersion = currentProduct?.body?.masterData?.current?.masterVariant?.availability?.version;
        await this.updateStockQuantity(productData)
      }
      productData.version = currentProduct?.body?.version;
      productData.priceId = currentProduct?.body?.masterData?.current?.masterVariant?.prices[0]?.id;
      
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

  private async setStockQuantity(productData) {
    try {
      const { sku, quantityOnStock } = productData;
          const inventory = await this.apiRoot
          .withProjectKey({ projectKey: this.projectKey })
          .inventory()
          .post({
            body: {
              sku,
              quantityOnStock
            },
          })
          .execute();

          return inventory
    } catch (error) {
      return error
    }
  }

  private async updateStockQuantity(productData) {
      try {
            const inventory = await this.apiRoot
            .withProjectKey({ projectKey: this.projectKey })
            .inventory()
            .withId({ID: productData.inventoryId})
            .post({
              body: {
                version: productData.inventoryVersion,
                actions: [{
                  action : "changeQuantity",
                  quantity : productData.quantityOnStock
                }]
              },
            })
            .execute();
  
            return inventory
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
