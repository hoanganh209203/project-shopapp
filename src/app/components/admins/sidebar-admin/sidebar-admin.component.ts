import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { CartService } from '../../../service/carts/cart.service';
import { TokenService } from '../../../service/tokens/token.service';
import { UserService } from '../../../service/auth/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.scss',
})
export class SidebarAdminComponent {
  isDropdownOpen = false;
  constructor(
    private cartService: CartService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router
  ) {}

  logOut() {
    debugger;
    this.cartService.clearCart(),
      this.tokenService.removeToken(),
      this.userService.removeUserFormLocalStorage();
    this.router.navigate(['/login']);
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
