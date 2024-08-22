import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestToastComponent } from './test-toast.component';

describe('TestToastComponent', () => {
  let component: TestToastComponent;
  let fixture: ComponentFixture<TestToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestToastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
