import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrders } from './product-orders';

describe('ProductOrders', () => {
  let component: ProductOrders;
  let fixture: ComponentFixture<ProductOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
