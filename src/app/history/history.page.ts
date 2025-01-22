import { Component } from '@angular/core';
import { Order } from '../interfaces/Order';
import { ApiService } from '../services/api.service';
import { AlertService } from '../services/alert.service';
import { ModalController } from '@ionic/angular';
import { ReviewOrderComponent } from '../components/review-order/review-order.component';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  standalone: false,
})
export class HistoryPage {

  groupedOrders: { date: string; orders: Order[] }[] = [];

  constructor(private apiService : ApiService, private alertService: AlertService, private modalController : ModalController) {}

  ionViewWillEnter(){
    this.groupOrdersByDate();
  }

  handleRefresh(event : any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.groupOrdersByDate();
      event.target.complete();
    }, 2000);
  }

  groupOrdersByDate(): void {
    const orders = this.apiService.getOrders();

    const grouped = orders.reduce((acc, order) => {
      const dateKey = new Date(order.date).toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(order);
      return acc;
    }, {} as Record<string, Order[]>);

    this.groupedOrders = Object.keys(grouped).map(date => ({
      date,
      orders: grouped[date],
    }));
  }

  onEditOrder(order: Order): void {
    console.log('Editar orden:', order);
    // Agregar lógica para editar la orden
    this.openReviewOrderModal(order);
  }

  onDeleteOrder(order : Order){
    this.alertService.showConfirmAlert(
      '¿Estás seguro que deseas eliminar esta orden?',
      'Confirmación',
      () => {
        this.apiService.deleteOrder(order.id);
        this.groupOrdersByDate(); // Recargar la lista
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
            this.groupOrdersByDate(); // Recargar la lista
          }
        });
        await modal.present();
      }

}
