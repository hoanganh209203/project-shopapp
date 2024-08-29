import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../service/carts/cart.service';
import { RouterLink } from '@angular/router';
import { UserService } from '../../service/auth/user.service';
import { UserResponse } from '../../interfaces/user.response';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../service/tokens/token.service';
import { ProductService } from '../../service/products/product.service';
import { ToastrService } from 'ngx-toastr';
import { ProductResponse } from '../../interfaces/product.response';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,NgIf,FormsModule,NgClass],
  templateUrl: './header.component.html',
  styleUrls:[ './header.component.scss']
})
export class HeaderComponent implements OnInit{
  products: ProductResponse[] = [];
  totalProducts: number = 0;
  activeNaveItem : number = 0;
  userResponse? : UserResponse | null;

  constructor(private cartService: CartService,

    private userService: UserService,
    private tokenService : TokenService,


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

  handlClick(item : number){
    if(item === 0){
      this.cartService.clearCart(),
      this.tokenService.removeToken(),
      this.userService.removeUserFormLocalStorage();
    }
  }

  setActiveNavItem(index : number){
    this.activeNaveItem = index;
  }



}


