import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExtensionModalComponent } from './new-extension-modal.component';

describe('NewExtensionModalComponent', () => {
  let component: NewExtensionModalComponent;
  let fixture: ComponentFixture<NewExtensionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewExtensionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExtensionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
