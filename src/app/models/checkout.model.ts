export interface CheckoutData {
  customerEmail: string,
  billingAddress: Address,
  shippingAddress: Address,
  payment: Payment
}

export interface Address {
  first_name: string;
  last_name: string;
  address1: string;
  address2: string;
  city: string
  country: string;
  state: string;
  zip: string;
  phone: string;
}

export interface Payment {
  ccNumber: string;
  ccExpiry: DateClass;
  ccCvv: string;
  ccNameOnCard: string;
}

export interface DateClass {
  year: number;
  month: number;
  day: number;
}

export function init(): CheckoutData {
  const emptyAddress: Address = {
    first_name: '',
    last_name: '',
    address1: '',
    address2: '',
    city: '',
    country: '',
    state: '',
    zip: '',
    phone: ''
  };
  const emptyPayment: Payment = {
    ccNumber: '',
    ccExpiry: undefined,
    ccCvv: '',
    ccNameOnCard: ''
  };
  return {
    customerEmail: '',
    shippingAddress: emptyAddress,
    billingAddress: emptyAddress,
    payment: emptyPayment
  }
}
