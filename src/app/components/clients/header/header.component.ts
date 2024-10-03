import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../../service/carts/cart.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterLink,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../../../service/auth/user.service';
import { UserResponse } from '../../../interfaces/user.response';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../service/tokens/token.service';
import { ProductResponse } from '../../../interfaces/product.response';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, CanActivate {
  products: ProductResponse[] = [];
  totalProducts: number = 0;
  activeNaveItem: number = 0;
  userResponse?: UserResponse | null;
  userId: number = 0;
  roleId: number = 0;
  isAdmin: boolean = false;
  constructor(
    private cartService: CartService,
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  canActivate(): any {
    const userRole = localStorage.getItem('user');
    if (userRole) {
      const user = JSON.parse(userRole);
      if (user && user.role_id === 2) {
        return true; // Nếu là admin, cho phép truy cập
      } else {
        this.router.navigate(['/']); // Điều hướng đến trang client nếu không phải admin
        return false;
      }
    }
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit(): void {
    this.updateTotalProducts();
    this.userResponse = this.userService.getUserFormLocalStorage();
    const userRole = localStorage.getItem('user');
    if (userRole) {
      debugger;
      const user = JSON.parse(userRole);
      if (user.role_id === 2) {
        this.isAdmin = true;
      }
    }
  }

  updateTotalProducts(): void {
    this.totalProducts = this.cartService.getTotalProducts();
  }

  handlClick(item: number) {
    switch (item) {
      case 0:
        this.cartService.clearCart(),
          this.tokenService.removeToken(),
          this.userService.removeUserFormLocalStorage();
        this.router.navigate(['login']);
        this.isDropdownOpen = false;
        break;
      case 1:
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          this.userId = user.id;
          debugger;
          this.router.navigate([`/order_user/${this.userId}`]);
        } else {
          console.error('User data not found in localStorage');
        }
        this.isDropdownOpen = false;
        break;
      case 2:
        this.router.navigate(['/admin/dashboard']);
        this.isDropdownOpen = false;
        break;
      default:
        this.isDropdownOpen = false;
    }
  }

  // Lắng nghe sự kiện click ngoài dropdown để tắt
  @HostListener('document:click', ['$event'])
  onClickOutSide(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-toggle')) {
      this.isDropdownOpen = false;
    }
  }

  // Ngăn sự kiện click bên trong dropdown kích hoạt @HostListener
  @HostListener('click', ['$event'])
  onClickInside(event: MouseEvent) {
    event.stopPropagation();
  }

  setActiveNavItem(index: number) {
    this.activeNaveItem = index;
  }
}
