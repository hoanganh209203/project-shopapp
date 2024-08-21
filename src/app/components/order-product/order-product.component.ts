import { Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../interfaces/product.response';
import { ProductService } from '../../service/products/product.service';
import { CartService } from '../../service/carts/cart.service';
import { environment } from '../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-order-product',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.scss']
})
export class OrderProductComponent implements OnInit {
  totalPrice: number = 0;
  cartItems: { product: ProductResponse; quantity: number }[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.updateTotalPrice();
  }

  loadCartItems(): void {
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys()); // chuyển danh sách Id từ MAP cart

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách id
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);

          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }

          return {
            product: product!,
            quantity: cart.get(productId) ?? 0 // Đảm bảo quantity luôn là số
          };
        });
      },
      error: (err: any) => {
        console.error("Error fetching product details", err);
      },
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.loadCartItems(); // Cập nhật lại giỏ hàng sau khi xóa sản phẩm
    this.updateTotalPrice(); // Cập nhật lại tổng tiền sau khi xóa sản phẩm
  }

  updateTotalPrice(): void {
    this.cartService.getTotalPrice().subscribe((price) => {
      this.totalPrice = price;
    });
  }
}
