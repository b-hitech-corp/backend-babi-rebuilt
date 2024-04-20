export interface CreateOrderInput {
  total_price: number
  shipping_address: string
  payment_method: string
  phone_number: string
  products: CartItem[]
}

export interface CartItem {
  product_id: number
  quantity: number
}

export interface OrderCreatedOutput {
  id: number
  total_price: number
  shipping_address: string
  payment_method: string
  phone_number: string
  stripe_payment_url: string
  tracking_number: string
  status: string
  is_delivered: boolean
  user_id: number
}
