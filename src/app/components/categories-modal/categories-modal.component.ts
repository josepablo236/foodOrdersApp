import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ReviewOrderComponent } from '../review-order/review-order.component';
import { Category } from 'src/app/interfaces/Category';
import { Product } from 'src/app/interfaces/Product';
import { OrderItem } from 'src/app/interfaces/OrderItem';

@Component({
  selector: 'app-categories-modal',
  imports:[CommonModule, IonicModule, FormsModule],
  templateUrl: './categories-modal.component.html',
  styleUrls: ['./categories-modal.component.scss'],
})
export class CategoriesModalComponent  implements OnInit {

  categories : Array<Category> = [
    { id: 1, name: 'Palicrepas Dulces',  icon: 'assets/img/Dulces.png'},
    { id: 2, name: 'Palicrepas Saladas', icon: 'assets/img/Salchicha.png'},
    { id: 3, name: 'Bebidas', icon:  'assets/img/Bebidas.png'},
    { id: 4, name: 'Toppings', icon: 'assets/img/Toppings.png'},
    { id: 5, name: 'Combos', icon: 'assets/img/CombosBebida.png'},
  ];

  productsList : Array<OrderItem> = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.productsList);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  selectCategory(category: Category) {
    this.openProductModal(category);
    // this.modalController.dismiss(category);
  }

  async openProductModal(category: Category) {
    const modal = await this.modalController.create({
      component: ProductModalComponent,
      componentProps: { selectedCategory: category },
      breakpoints: [0.45, 0.60], // Define las alturas relativas
      initialBreakpoint: 0.45, // Altura inicial del modal
      cssClass: 'sheet-modal', // Clase opcional para personalizar estilos
    });
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        console.log('Producto agregado:', data.data);
        // Agrega el producto a tu lista de órdenes aquí
        this.productsList.push(data.data);
      }
    });
    return await modal.present();
  }

  goToOrder(){
    this.openReviewOrderModal();
    // this.modalController.dismiss();
  }

  async openReviewOrderModal() {
    const modal = await this.modalController.create({
      component: ReviewOrderComponent,
      componentProps: {
        orderItems: this.productsList, // Lista de productos en la orden
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        console.log('Orden agregada:', data.data);
        this.dismissModal();
      }
    });
    await modal.present();
  }

}
