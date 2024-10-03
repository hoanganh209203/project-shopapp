import { Component } from '@angular/core';
import { SidebarAdminComponent } from '../../components/admins/sidebar-admin/sidebar-admin.component';
import { OrderStatisticsComponent } from '../../components/orders/order-statistics/order-statistics.component';
import { OrderStatisticsDailyComponent } from '../../components/orders/order-statistics-daily/order-statistics-daily.component';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [
    SidebarAdminComponent,
    OrderStatisticsComponent,
    OrderStatisticsDailyComponent,
  ],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.scss',
})
export class AdminsComponent {}
