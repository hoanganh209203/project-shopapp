import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminsComponent } from '../../page/admins/admins.component';
import { SidebarAdminComponent } from '../../components/admins/sidebar-admin/sidebar-admin.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AdminsComponent, SidebarAdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {}
