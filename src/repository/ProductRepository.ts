import CommercetoolsClient from '../commerctools/Client';
import { ApiRoot, ProductDraft } from '@commercetools/platform-sdk';
import {
  UpdateProductActions,
  ChangeNameAction,
  SetDescriptionAction,
  ChangePriceAction,
  UnpublishAction,
} from '../types/product';

interface IProductRepository {
  apiRoot: ApiRoot;
  projectKey: string;
  currency: string;
  getProducts(): any | Error;
  getProductById(productId: string): any | Error;
  addProduct(productData): any | Error;
  updateProduct(productData): any | Error;
  deleteProductById(productId: string): any | Error;
}

class Product implements IProductRepository {
  apiRoot: ApiRoot;
  projectKey: string;
  currency: string;
  constructor(options) {
    const rootClient = new CommercetoolsClient(options);
    this.apiRoot = rootClient.getApiRoot(
      rootClient.getClientFromOption(options)
    );
    this.projectKey = rootClient.getProjectKey();
    this.currency = process.env.DEFAULT_CURRENCY;
  }

  async getProducts() {
    try {
      const products = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .products()
        .get()
        .execute();

      return products;
    } catch (error) {
      return error;
    }
  }

  async getProductById(productId: string) {
    try {
      const product = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .products()
        .withId({ ID: productId })
        .get()
        .execute();

      return product;
    } catch (error) {
      return error;
    }
  }

  async addProduct(productData) {
    try {
      const product = await this.apiRoot
      .withProjectKey({ projectKey: this.projectKey })
      .products()
      .post({
        body: this.createProductDraft(productData),
      })
      .execute();
    
       // update inventory if quantityOnStock is included
      if (productData.quantityOnStock) {
        await this.setStockQuantity(productData);
      }
      return product;
    } catch (error) {
      return error;
    }
  }

  async updateProduct(productData) {
    try {
      const currentProduct = await this.getProductById(productData.productId);
      // update inventory if quantityOnStock is included
      if (productData.quantityOnStock) {
        productData.inventoryId =
          currentProduct?.body?.masterData?.current?.masterVariant?.availability?.id;
        productData.inventoryVersion =
          currentProduct?.body?.masterData?.current?.masterVariant?.availability?.version;
        await this.updateStockQuantity(productData);
      }
      productData.version = currentProduct?.body?.version;
      productData.priceId =
        currentProduct?.body?.masterData?.current?.masterVariant?.prices[0]?.id;

      const product = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .products()
        .withId({ ID: productData.productId })
        .post({
          body: this.createProductUpdateDraft(productData),
        })
        .execute();

      return product;
    } catch (error) {
      return error;
    }
  }

  async deleteProductById(productId: string) {
    try {
      const currentProduct = await this.getProductById(productId);
      // return data if not successful response
      if (currentProduct.statusCode !== 200) {
        return currentProduct;
      }
      const unpublishedProduct = await this.unpublishProduct(currentProduct);

      const deleteProduct = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .products()
        .withId({ ID: productId })
        .delete({
          queryArgs: {
            version: unpublishedProduct?.body?.version,
          },
        })
        .execute();
      return deleteProduct;
    } catch (error) {
      return error;
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
            quantityOnStock,
          },
        })
        .execute();

      return inventory;
    } catch (error) {
      return error;
    }
  }

  private async updateStockQuantity(productData) {
    try {
      const inventory = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .inventory()
        .withId({ ID: productData.inventoryId })
        .post({
          body: {
            version: productData.inventoryVersion,
            actions: [
              {
                action: 'changeQuantity',
                quantity: productData.quantityOnStock,
              },
            ],
          },
        })
        .execute();

      return inventory;
    } catch (error) {
      return error;
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

      return product;
    } catch (error) {
      return error;
    }
  }

  createProductDraft(productData): ProductDraft {
    const { slug, name, description, sku, price } = productData;
    const productType = 'product-type';
    const productTypeId = 'fba500bd-e91e-498c-a30a-d636c66521de'; // currently only 1 product type has been created
    const taxType = 'tax-category';
    const taxTypeId = 'cbae3370-a392-4a53-ad15-10eabe88867e'; // standard tax category

    return {
      name: {
        'en-GB': name, // using en-GB locale for simplicity, can be replaced with locale from i18n
      },
      productType: {
        typeId: productType,
        id: productTypeId,
      },
      description: {
        'en-GB': description,
      },
      slug: {
        'en-GB': slug,
      },
      masterVariant: {
        sku,
        prices: [
          {
            value: {
              currencyCode: this.currency,
              centAmount: price,
            },
          },
        ],
      },
      taxCategory: {
        typeId: taxType,
        id: taxTypeId,
      },
      publish: true,
    };
  }

  createProductUpdateDraft(productData): UpdateProductActions {
    const { version, name, description, price } = productData;
    const actions = [];
    if (name) {
      const changeNameAction: ChangeNameAction = {
        action: 'changeName',
        name: {
          'en-GB': name,
        },
      };
      actions.push(changeNameAction);
    }
    if (description) {
      const setDescriptionAction: SetDescriptionAction = {
        action: 'setDescription',
        description: {
          'en-GB': description,
        },
      };
      actions.push(setDescriptionAction);
    }
    if (price) {
      const changePriceAction: ChangePriceAction = {
        action: 'changePrice',
        priceId: productData.priceId,
        price: {
          value: {
            currencyCode: this.currency,
            centAmount: price,
          },
        },
      };
      actions.push(changePriceAction);
    }

    // publish product updates
    if (actions.length) {
      actions.push({ action: 'publish' });
    }

    return {
      version,
      actions,
    };
  }

  unpublishProductDraft(version: number): UnpublishAction {
    return {
      version,
      actions: [
        {
          action: 'unpublish',
        },
      ],
    };
  }
}

export default Product;
