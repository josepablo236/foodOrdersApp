import { OrderItem } from "./OrderItem";

export interface Order {
    id: number; // ID único de la orden
    items: OrderItem[]; // Lista de productos en la orden
    total: number; // Total de la orden (suma de todos los totalPrice de OrderItem)
    customer?: string;
    paymentMethod: 'efectivo' | 'tarjeta'; // Método de pago
    amountReceived?: number; // Cantidad recibida (solo para efectivo)
    change?: number; // Vuelto a entregar (solo para efectivo)
    date: Date; // Fecha y hora de la orden
  }