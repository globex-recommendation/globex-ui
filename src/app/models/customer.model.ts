export interface Customer {
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: Address
}

export interface Address {
  address1: string,
  address2: string,
  city: string,
  zipCode: string,
  state: string,
  country: string
}
