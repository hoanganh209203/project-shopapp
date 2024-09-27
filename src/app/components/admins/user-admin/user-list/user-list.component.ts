import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserResponse } from '../../../../interfaces/user.response';
import { UserService } from '../../../../service/auth/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  users: UserResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  page: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getUser(this.currentPage, this.itemsPerPage);
  }

  getUser(page: number, limit: number) {
    this.userService.getAllUser(page, limit).subscribe({
      next: (response: any) => {
        this.toastr.success('List User Successfully', 'User', {
          timeOut: 2000,
        });
        this.users = response.user;
        this.visiblePages = this.generateVisiblePageArry(
          this.currentPage,
          this.totalPages
        );
        this.isLoading = false;
      },
      complete: () => {
        console.log(123);
      },
      error: (error: any) => {
        console.error('Error get category', error);
      },
    });
  }
  onPageChange(page: number, event: MouseEvent) {
    this.isLoading = true;
    event.preventDefault();
    this.currentPage = page;
    this.getUser(this.currentPage, this.itemsPerPage);
    this.isLoading = false;
  }

  generateVisiblePageArry(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }
}
