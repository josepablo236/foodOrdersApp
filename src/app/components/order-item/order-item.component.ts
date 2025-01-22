import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Order } from 'src/app/interfaces/Order';

@Component({
  selector: 'app-order-item',
  imports:[CommonModule, IonicModule, FormsModule],
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent  implements OnInit {

  @Input() order!: Order; // Recibe la orden
  @Output() editOrder = new EventEmitter<Order>(); // Emite evento para editar
  @Output() deleteOrder = new EventEmitter<Order>(); // Emite evento para eliminar

  constructor() { }

  ngOnInit() {}

  onEdit(): void {
    this.editOrder.emit(this.order); // Emite la orden para editar
  }

  onDelete(): void {
    this.deleteOrder.emit(this.order); // Emite la orden para eliminar
  }

}
