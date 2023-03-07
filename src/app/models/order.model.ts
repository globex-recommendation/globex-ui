export interface Order {
  customer: string,
  shippingAddress: ShippingAddress,
  lineItems: LineItem[]
}

export interface ShippingAddress {
  name: string,
  phone: string,
  address1: string,
  address2: string,
  city: string,
  zip: string,
  state: string,
  country: string
}

export interface LineItem {
  product: string,
  quantity: number,
  price: number
}