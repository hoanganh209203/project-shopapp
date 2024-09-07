import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../service/carts/cart.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/auth/user.service';
import { UserResponse } from '../../interfaces/user.response';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../service/tokens/token.service';
import { ProductResponse } from '../../interfaces/product.response';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  products: ProductResponse[] = [];
  totalProducts: number = 0;
  activeNaveItem: number = 0;
  userResponse?: UserResponse | null;
  userId: number = 0;
  constructor(
    private cartService: CartService,
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {}
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit(): void {
    this.updateTotalProducts();
    this.userResponse = this.userService.getUserFormLocalStorage();
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
        break;
      case 2:
        break;
    }
  }

  // myOrder() {
  //   const userData = localStorage.getItem('user'); // Lấy dữ liệu user từ localStorage
  //   if (userData) {
  //     const user = JSON.parse(userData); // Chuyển đổi chuỗi JSON thành object
  //     this.userId = user.id;

  //     // Điều hướng đến trang 'order_user/:iduser'
  //     this.router.navigate([`/order_user/${this.userId}`]);
  //   } else {
  //     // Xử lý trường hợp không có dữ liệu người dùng trong localStorage
  //     console.error('User data not found in localStorage');
  //   }
  // }

  setActiveNavItem(index: number) {
    this.activeNaveItem = index;
  }
}
