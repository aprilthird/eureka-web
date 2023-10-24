import Customer from './customer'
import Product from './product'

export default class Sale {
  id: number = 0
  productId: number = 0
  unitPrice: number = 0.0
  createDate: string = ''
  saleDate: Date = new Date()
  product: Product = new Product()
  customer: Customer = new Customer()
}
