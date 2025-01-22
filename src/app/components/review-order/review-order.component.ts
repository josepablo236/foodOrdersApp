import { CommonModule, formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Order } from 'src/app/interfaces/Order';
import { OrderItem } from 'src/app/interfaces/OrderItem';
import { ApiService } from 'src/app/services/api.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { Product } from 'src/app/interfaces/Product';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-review-order',
  imports:[CommonModule, IonicModule, FormsModule],
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.scss'],
})
export class ReviewOrderComponent  implements OnInit {

  @Input() orderItems: OrderItem[] = []; // Items de la orden
  @Input() order: Order = { id: 0, items: this.orderItems, total: 0, paymentMethod : 'efectivo', amountReceived: 0, change: 0, date: new Date() }
  total: number = 0; // Total de la orden
  paymentMethod: any = 'efectivo'; // Método de pago por defecto
  amountReceived: number = 0; // Cantidad recibida
  change: number = 0; // Vuelto a devolver
  isProductEdited : boolean = false;
  errorMessage : string = '';
  customerName : string = '';
  isEdit : boolean = false;

  constructor(private modalController: ModalController, private apiService : ApiService, private alertService : AlertService) { }

  ngOnInit() {
    if(this.order.id !== 0){
      this.isEdit = true;
      this.total = this.order.total;
      this.paymentMethod = this.order.paymentMethod;
      this.orderItems = this.order.items;
      if(this.order.amountReceived !== undefined && this.order.change !== undefined){
        this.amountReceived = this.order.amountReceived;
        this.change = this.order.change;
      }
      if(this.order.customer !== undefined){
        this.customerName = this.order.customer;
      }
    }
    this.calculateTotal();
  }

  // Cerrar el modal
  dismiss() {
    this.modalController.dismiss();
  }

  // Confirmar la orden
  confirmOrder() {
    // Lógica para confirmar la orden
    const orderValidate = this.validateOrder();
    if(orderValidate){
      //Cambiar id unico
      this.order = {id: Date.now(), items: this.orderItems, total: this.total, customer: this.customerName, paymentMethod: this.paymentMethod, amountReceived: this.amountReceived, change: this.change, date: new Date()}
      this.apiService.saveOrder(this.order);
      this.isEdit ? this.alertService.showAlert('Guardado', 'Orden editada correctamente.') : this.alertService.showAlert('Guardado', 'Orden guardada correctamente.');
      this.modalController.dismiss(this.order);
    }
    else{
      this.alertService.showAlert('Error', this.errorMessage);
    }
  }

  //Metodo que define si la orden es válida
  validateOrder() : boolean{
    this.errorMessage = '';
    let valido = false;
    if(this.orderItems.length > 0){ //Hay items para agregar a la orden
      if(this.paymentMethod === 'efectivo'){
        if(this.amountReceived > 0 && this.amountReceived >= this.total) { valido = true }else{ valido = false; this.errorMessage = "La cantidad recibida es incorrecta.";}
        if(this.change >= 0 ){ valido= true }else{ valido = false; this.errorMessage = "El cambio debe ser mayor o igual a cero.";}
      }
      if(this.total >= 0 ){ valido= true }else{ valido = false, this.errorMessage = "El total no puede ser cero.";}
      //Agregar nombre del cliente
    }
    else{
      valido = false;
      this.errorMessage = "No hay productos para agregar a la orden."
    }
    if(this.errorMessage === ''){valido = true;} else{valido = false;}
    console.log("Orden valida", valido, this.errorMessage);
    return valido;
  }

  // Calcular el vuelto si el pago es en efectivo
  calculateChange() {
    if (this.paymentMethod === 'efectivo') {
      this.change = this.amountReceived - this.total;
    }
  }

  // Eliminar un producto de la orden
  removeItem(index: number) {
    this.orderItems.splice(index, 1);
    this.calculateTotal();
    this.calculateChange()
  }

  // Editar un producto en la orden (puedes implementar esto como un modal o una nueva vista)
  editItem(index: number) {
    // Lógica para editar el producto
    this.openProductModal(this.orderItems[index]);
  }

  async openProductModal(orderItem : OrderItem) {
      const modal = await this.modalController.create({
        component: ProductModalComponent,
        componentProps: { itemToEdit: orderItem },
        breakpoints: [0.30, 0.40], // Define las alturas relativas
        initialBreakpoint: 0.30, // Altura inicial del modal
        cssClass: 'sheet-modal', // Clase opcional para personalizar estilos
      });
      modal.onDidDismiss().then((data) => {
        if (data.data) {
          // Agrega el producto a tu lista de órdenes aquí
          let index = this.orderItems.findIndex(x=>x.id == data.data.id);
          this.removeItem(index);
          this.orderItems.push(data.data);
          this.calculateTotal();
          this.calculateChange();
        }
      });
      return await modal.present();
    }

  // Calcular el total de la orden
  calculateTotal() {
    this.total = this.orderItems.reduce((acc, item) => acc + (item.totalPrice), 0);
  }

}
