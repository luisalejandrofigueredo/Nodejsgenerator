import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionRoutesModalComponent } from './extension-routes-modal.component';

describe('ExtensionRoutesModalComponent', () => {
  let component: ExtensionRoutesModalComponent;
  let fixture: ComponentFixture<ExtensionRoutesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtensionRoutesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionRoutesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
