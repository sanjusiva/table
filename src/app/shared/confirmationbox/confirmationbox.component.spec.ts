import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationboxComponent } from './confirmationbox.component';

describe('ConfirmationboxComponent', () => {
  let component: ConfirmationboxComponent;
  let fixture: ComponentFixture<ConfirmationboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
