import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { HeaderComponent } from '../components/header/header.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    DashboardPageRoutingModule,
    HeaderComponent
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
