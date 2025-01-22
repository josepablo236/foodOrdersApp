import { Injectable } from '@angular/core';
import { Order } from '../interfaces/Order';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private storageKey = 'orders'; // Clave para guardar las órdenes

  constructor() { }

  //Guardar ordenes
  private saveOrders(orders: Order[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
  }

  // Guardar una nueva orden
  saveOrder(order: Order): void {
    const currentOrders = this.getOrders();
    currentOrders.push(order); // Agrega la nueva orden
    this.saveOrders(currentOrders);
  }

  // Obtener todas las órdenes
  getOrders(): Order[] {
    const orders = localStorage.getItem(this.storageKey);
    return orders ? JSON.parse(orders) : [];
  }

  //Editar una orden
  editOrder(updatedOrder: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === updatedOrder.id);

    if (index !== -1) {
      orders[index] = updatedOrder; // Reemplazar la orden existente
      this.saveOrders(orders);
    } else {
      console.error('La orden no existe y no se puede editar.');
    }
  }

  deleteOrder(orderId: number): void {
    const orders = this.getOrders();
    const updatedOrders = orders.filter(order => order.id !== orderId);
    this.saveOrders(updatedOrders);
  }

  // Borrar todas las órdenes
  clearOrders(): void {
    localStorage.removeItem(this.storageKey);
  }
}
