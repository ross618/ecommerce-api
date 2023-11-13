export type ChangeNameAction = {
  readonly action: 'changeName';
  name: {
    'en-GB': string;
  };
};

export type SetDescriptionAction = {
  readonly action: 'setDescription';
  description: {
    'en-GB': string;
  };
};

export type ChangePriceAction = {
  readonly action: 'changePrice';
  priceId: string;
  price: {
    value: {
      currencyCode: string;
      centAmount: number;
    };
  };
};

export type UnpublishAction = {
  version: number;
  actions: Array<{ readonly action: 'unpublish' }>;
};

export type UpdateProductActions = {
  version: number;
  actions: Array<ChangeNameAction | SetDescriptionAction | ChangePriceAction>;
};