import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoriesModalComponent } from '../components/categories-modal/categories-modal.component';
import { ApiService } from '../services/api.service';
import { Order } from '../interfaces/Order';
import { AlertService } from '../services/alert.service';
import { ReviewOrderComponent } from '../components/review-order/review-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.page.html',
  styleUrls: ['orders.page.scss'],
  standalone: false,
})
export class OrdersPage {

  totalOrders = 0; 
  totalSales = 0;
  orders : Order[] = [];

  constructor(private modalController: ModalController, private apiService : ApiService, private alertService : AlertService) {}

  ionViewWillEnter(){
    this.loadData();
  }

  loadData(){
    this.loadTodayOrders();
    this.totalOrders = this.orders.length;
    this.totalSales = this.orders.reduce((acc, item) => acc + (item.total), 0 );
  }

  handleRefresh(event : any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.loadData();
      event.target.complete();
    }, 2000);
  }

  loadTodayOrders(){
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.orders = this.apiService.getOrders().filter(x => new Date(x.date) >= startOfDay);
  }

  async openNewOrderModal() {
    const modal = await this.modalController.create({
      component: CategoriesModalComponent,
    });
    await modal.present();
  }

  onEditOrder(order: Order): void {
    console.log('Editar orden:', order);
    // Agregar lógica para editar la orden
    this.openReviewOrderModal(order);
  }

  onDeleteOrder(order: Order): void {
    this.alertService.showConfirmAlert(
      '¿Estás seguro que deseas eliminar esta orden?',
      'Confirmación',
      () => {
        this.apiService.deleteOrder(order.id);
        this.loadData(); // Recargar la lista
      }
    );
  }

  async openReviewOrderModal(order : Order) {
      const modal = await this.modalController.create({
        component: ReviewOrderComponent,
        componentProps: {
          order: order, //Manda la orden a editar
        }
      });
      modal.onDidDismiss().then((data) => {
        if (data.data) {
          console.log('Orden editada:', data.data);
          this.apiService.deleteOrder(order.id);
          this.loadData(); // Recargar la lista
        }
      });
      await modal.present();
    }

}
