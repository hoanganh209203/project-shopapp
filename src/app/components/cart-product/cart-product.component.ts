import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../interfaces/product.response';
import { ProductService } from '../../service/products/product.service';
import { CartService } from '../../service/carts/cart.service';
import { environment } from '../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-product',
  standalone: true,
  imports: [NgFor, CommonModule,FormsModule],
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent implements OnInit {
  totalPrice: number = 0;
  cartItems: { product: ProductResponse; quantity: number }[] = [];
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService,

  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadCartItems();
  }

  loadCartItems(): void {
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);

          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }

          return {
            product: product!,
            quantity: cart.get(productId) ?? 0
          };
        });
        this.updateTotalPrice();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error('Order Error', 'Order Product', { timeOut: 3000 });
        console.error("Error fetching product details", err);
        this.isLoading = false;
      }
    });
  }

  increaseQuantity(productId: number): void {

    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      item.quantity++;
      this.cartService.updateCart(productId, item.quantity); // Cập nhật giỏ hàng
      this.updateLocalStorage(); // Cập nhật localStorage
      this.updateTotalPrice(); // Cập nhật tổng tiền
    }
  }

  decreaseQuantity(productId: number): void {

    const item = this.cartItems.find(i => i.product.id === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(productId, item.quantity); // Cập nhật giỏ hàng
      this.updateLocalStorage(); // Cập nhật localStorage
      this.updateTotalPrice(); // Cập nhật tổng tiền
    } else if (item && item.quantity === 1) {
      this.removeItem(productId); // Xóa sản phẩm nếu quantity là 1
    }
  }
  removeItem(productId: number): void {
    if (window.confirm("Are you sure you want to delete?")) {
      this.isLoading = true;
      this.toastr.info('Removed product from cart', 'Delete Cart', { timeOut: 3000 });
      this.cartService.removeFromCart(productId);
      this.updateLocalStorage(); // Cập nhật localStorage
      this.loadCartItems(); // Tải lại giỏ hàng
    }
  }

  updateLocalStorage(): void {
    debugger
    const cart = new Map<number, number>(); // Sử dụng Map để lưu trữ id sản phẩm và số lượng
    this.cartItems.forEach(item => {
      cart.set(item.product.id, item.quantity);
    });
    localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
  }

  updateTotalPrice(): void {
  
    this.cartService.getTotalPrice().subscribe({
      next: (price) => {
        this.totalPrice = price;
      },
      error: (err) => {
        console.error("Error fetching total price", err);
      }
    });
  }
}
