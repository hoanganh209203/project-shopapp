import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test-toast',
  standalone: true,
  imports: [],
  templateUrl: './test-toast.component.html',
  styleUrl: './test-toast.component.scss',
})
export class TestToastComponent {

  name = 'Angular 5';
  constructor(private toastr: ToastrService){}

  showSuccess(){
    debugger
   this.toastr.success('everything is broken', 'Major Error');
  }
  showError(){
   this.toastr.error('everything is broken', 'Major Error', {
  timeOut: 3000,
});
  }
   showInfo(){
   this.toastr.info('everything is broken', 'Major Error', {
  timeOut: 3000,
});
  }
   showWarning(){
   this.toastr.warning('everything is broken', 'Major Error', {
  timeOut: 3000,
});
  }
}
