import { Component } from '@angular/core';
import { SidebarAdminComponent } from '../../components/admins/sidebar-admin/sidebar-admin.component';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [SidebarAdminComponent],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.scss',
})
export class AdminsComponent {}
