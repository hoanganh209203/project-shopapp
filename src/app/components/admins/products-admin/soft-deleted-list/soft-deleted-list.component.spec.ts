import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftDeletedListComponent } from './soft-deleted-list.component';

describe('SoftDeletedListComponent', () => {
  let component: SoftDeletedListComponent;
  let fixture: ComponentFixture<SoftDeletedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftDeletedListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoftDeletedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
