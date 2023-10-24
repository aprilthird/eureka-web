export default class ApiUtils {
  static customersUrl: string = process.env.CUSTOMERS_URL ?? ''
  static productsUrl: string = process.env.PRODUCTS_URL ?? ''
  static salesUrl: string = process.env.SALES_URL ?? ''

  static authUrl: string = process.env.AUTH_URL ?? ''
}
