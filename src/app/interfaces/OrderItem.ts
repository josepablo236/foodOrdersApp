import { Product } from "./Product";

export interface OrderItem {
    id: number;
    product: Product; // Producto agregado a la orden
    quantity: number; // Cantidad del producto
    totalPrice: number; // Precio total por producto (quantity * product.price)
  }