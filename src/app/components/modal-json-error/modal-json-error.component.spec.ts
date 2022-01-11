import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalJsonErrorComponent } from './modal-json-error.component';

describe('ModalJsonErrorComponent', () => {
  let component: ModalJsonErrorComponent;
  let fixture: ComponentFixture<ModalJsonErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalJsonErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalJsonErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
