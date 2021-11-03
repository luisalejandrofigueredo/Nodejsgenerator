import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseExtensionRoutesComponent } from './browse-extension-routes.component';

describe('BrowseExtensionRoutesComponent', () => {
  let component: BrowseExtensionRoutesComponent;
  let fixture: ComponentFixture<BrowseExtensionRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseExtensionRoutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseExtensionRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
