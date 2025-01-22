import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersPage } from './orders.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { OrdersPageRoutingModule } from './orders-routing.module';
import { HeaderComponent } from '../components/header/header.component';
import { OrderItemComponent } from '../components/order-item/order-item.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    OrdersPageRoutingModule,
    HeaderComponent,
    OrderItemComponent,
  ],
  declarations: [OrdersPage]
})
export class OrderPageModule {}
