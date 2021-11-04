import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionServiceModalComponent } from './extension-service-modal.component';

describe('ExtensionServiceModalComponent', () => {
  let component: ExtensionServiceModalComponent;
  let fixture: ComponentFixture<ExtensionServiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtensionServiceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
