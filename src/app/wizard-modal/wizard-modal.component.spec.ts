import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardModalComponent } from './wizard-modal.component';

describe('WizardModalComponent', () => {
  let component: WizardModalComponent;
  let fixture: ComponentFixture<WizardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
