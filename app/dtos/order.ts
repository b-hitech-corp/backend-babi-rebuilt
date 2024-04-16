interface OrderDto {
  total_price: number
  shipping_address: string
  payment_method: string
  phone_number: string
  products: OrderProduct[]
}

interface OrderProduct {
  product_id: number
  quantity: number
}
