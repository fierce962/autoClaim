import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadFileSecretComponent } from './load-file-secret.component';

describe('LoadFileSecretComponent', () => {
  let component: LoadFileSecretComponent;
  let fixture: ComponentFixture<LoadFileSecretComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadFileSecretComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadFileSecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
