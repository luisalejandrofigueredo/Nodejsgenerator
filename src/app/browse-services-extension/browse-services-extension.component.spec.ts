import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseServicesExtensionComponent } from './browse-services-extension.component';

describe('BrowseServicesExtensionComponent', () => {
  let component: BrowseServicesExtensionComponent;
  let fixture: ComponentFixture<BrowseServicesExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseServicesExtensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseServicesExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
