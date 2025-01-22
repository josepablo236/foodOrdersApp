import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryPage } from './history.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { HistoryPageRoutingModule } from './history-routing.module';
import { HeaderComponent } from '../components/header/header.component';
import { OrderItemComponent } from '../components/order-item/order-item.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HistoryPageRoutingModule,
    HeaderComponent,
    OrderItemComponent
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule {}
