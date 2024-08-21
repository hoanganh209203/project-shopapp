import { Component } from '@angular/core';
import { CartService } from '../../service/carts/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls:[ './header.component.scss']
})
export class HeaderComponent {
  totalProducts: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateTotalProducts();
  }

  updateTotalProducts(): void {
    this.totalProducts = this.cartService.getTotalProducts();
  }

}
