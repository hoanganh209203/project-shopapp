import { Injectable } from '@angular/core';
import { ProductService } from '../products/product.service';
import { map, Observable, of } from 'rxjs';
import { ProductResponse } from '../../interfaces/product.response';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Dùng Map để lưu trữ giỏ hàng , key là id sản phẩm, value là số lượng
  private cart: Map<number, number> = new Map();

  constructor(private productService: ProductService) {
    //Lấy dữ liệu giỏ hàng từ localStorage khi khởi tạo service
    const storeCart = localStorage.getItem('cart');
    if (storeCart) {
      this.cart = new Map(JSON.parse(storeCart));
    }
  }

  addToCart(productId: number, quantity: number = 1): void {
    if (this.cart.has(productId)) {
      //Nếu sản phẩm đã có trong giỏ hàng thì tăng số lượng 'quantity'
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      //Nếu sản phẩm chưa có trong giỏ hàng thì thêm sản phẩm vào số lượng quantity
      this.cart.set(productId, quantity);
    }
    //Lưu thay đổi giỏ hàng
    this.saveCartToLocalStorage();
  }

  getCart(): Map<number, number> {
    return this.cart;
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem(
      'cart',
      JSON.stringify(Array.from(this.cart.entries()))
    );
  }

  clearCart(): void {
    this.cart.clear(); //Xóa toàn bộ dữ liệu trong giỏ hàng
    this.saveCartToLocalStorage(); //Lưu giỏ hàng mới vào Local Storage trống
  }

  getTotalQuantity(): number {
    let total = 0;
    this.cart.forEach((quantity) => {
      total += quantity;
    });
    return total;
  }

  //Xóa 1 item cart
  removeFromCart(productId: number): void {
    if (this.cart.has(productId)) {
      this.cart.delete(productId); // Xóa sản phẩm khỏi giỏ hàng
      this.saveCartToLocalStorage(); // Cập nhật lại localStorage sau khi xóa
    } else {
      console.error('Sản phẩm không có trong giỏ hàng');
    }
  }

  getTotalProducts(): number {
    return this.cart.size; // Kích thước của Map sẽ cho biết số loại sản phẩm
  }

  // Phương thức để tính tổng số tiền
  getTotalPrice(): Observable<number> {
    const productIds = Array.from(this.cart.keys());

    if (productIds.length === 0) {
      return of(0); // Trả về 0 nếu giỏ hàng trống
    }

    return this.productService.getProductsByIds(productIds).pipe(
      map((products: ProductResponse[]) => {
        let totalPrice = 0;
        products.forEach((product: ProductResponse) => {
          const quantity = this.cart.get(product.id) || 0;
          totalPrice += +product.price * quantity;
        });
        return totalPrice;
      })
    );
  }

}
