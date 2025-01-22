import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { OrderItem } from 'src/app/interfaces/OrderItem';
import { Product } from 'src/app/interfaces/Product';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-product-modal',
  imports:[CommonModule, IonicModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent  implements OnInit {

  @Input() selectedCategory: any; // Recibe la categoría seleccionada
  @Input() itemToEdit: OrderItem | null = null;

  products : Array<Product> = [{id: 0, categoryId: 0,  name:'', price: 0, cost:0, description: ''}];
  selectedProduct: Product = {id: 0, categoryId: 0,  name:'', price: 0, cost:0, description: ''};
  orderItem : OrderItem = { id: 0, product: this.selectedProduct, quantity: 0, totalPrice: 0}
  quantity = 1;
  isEdit : boolean = false;

  constructor(private modalController: ModalController, private alertService : AlertService) { }

  ngOnInit() {
    if(this.itemToEdit){
      this.selectedProduct = this.itemToEdit.product;
      this.quantity = this.itemToEdit.quantity;
      this.isEdit = true;
    }
    else{
      this.loadProducts(this.selectedCategory.id);
    }
  }

  loadProducts(idCategory : number){
    //Cambiar el switch por una consulta al Back para traer los productos segun categoria
    switch (idCategory) {
      case 1:
        this.products = [
          { id: 1, categoryId: idCategory, name: 'Palicrepa Nutella', price: 15, cost: 10, description: 'Palicrepa de Nutella' },
          { id: 2, categoryId: idCategory, name: 'Palicrepa Dulce Leche', price: 15, cost: 10, description: 'Palicrepa Dulce Leche' }
        ];
        break;
      case 2:
        this.products = [
          { id: 3, categoryId: idCategory, name: 'Palicrepa Salchicha', price: 20, cost:10, description: 'Palicrepa Salchicha' },
          { id: 4, categoryId: idCategory, name: 'Palicrepa Queso', price: 15, cost:10, description: 'Palicrepa Queso' }
        ];
        break;
      case 3:
        this.products = [
          { id: 5, categoryId: idCategory, name: 'Botella Agua', price: 5, cost: 2.50, description: 'Botella Agua' },
          { id: 6, categoryId: idCategory, name: 'Refresco natural', price: 10, cost:5, description: 'Refresco natural'},
          { id: 7, categoryId: idCategory, name: 'Té', price: 10, cost: 5, description: 'Té' },
        ];
        break;
      case 4:
        this.products = [
          { id: 8, categoryId: idCategory, name: 'Nutella', price: 5, cost: 3, description: 'Nutella' },
          { id: 9, categoryId: idCategory, name: 'Dulce Leche', price: 5, cost: 3, description: 'Dulce Leche' },
          { id: 10, categoryId: idCategory, name: 'Anisillos', price: 5, cost: 3, description: 'Anisillos' },
        ];
        break;
      case 5:
        this.products = [
          { id: 11, categoryId: idCategory, name: '2 Palicrepas', price: 30, cost: 20,  description: '2 Palicrepas' },
          { id: 12, categoryId: idCategory, name: 'Palicrepa y bebida', price: 25, cost: 15,  description: 'Palicrepa y bebida' },
          { id: 13, categoryId: idCategory, name: '6 Palicrepas', price: 40, cost: 25,  description: '6 Palicrepas' },
        ];
        break;
      default:
        break;
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  onProductChange(event: any) {
    this.selectedProduct = event.detail.value;
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToOrder() {
    if (this.selectedProduct.name) {
      this.orderItem.id = Date.now(); //id unico
      this.orderItem.product = this.selectedProduct;
      this.orderItem.quantity = this.quantity;
      this.orderItem.totalPrice = this.orderItem.quantity * this.orderItem.product.price;
      this.alertService.showAlert('Guardado', 'Producto agregado exitosamente');
      this.modalController.dismiss(this.orderItem); // Devuelve el producto seleccionado al componente padre
    } else {
      this.alertService.showAlert('Error', 'Porfavor selecciona un producto');
    }
  }

}
