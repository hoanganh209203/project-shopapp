import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUserIdComponent } from './order-user-id.component';

describe('OrderUserIdComponent', () => {
  let component: OrderUserIdComponent;
  let fixture: ComponentFixture<OrderUserIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderUserIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderUserIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
