export type CartDraft = {
  currency: string
  customerEmail?: string
}

export type MyCartUpdate = {
  version: number
  actions: Array<MyCartUpdateAction>
}

export type MyCartUpdateAction = {
  readonly action: 'addLineItem'
  readonly productId?: string
  readonly variantId?: number
  readonly quantity?: number
}

export type MyCartRemoveItem = {
  version: number
  actions: Array<MyCartRemoveLineItemAction>
}

export type MyCartRemoveLineItemAction = {
  readonly action: 'removeLineItem'
  readonly lineItemId: string
  readonly quantity?: number
}

export type CartUpdateDraft = {
  version: number
  productId: string
  variantId: number
  quantity: number
}

export type CartRemoveItemDraft = {
  version: number
  lineItemId: string
  quantity: number
}