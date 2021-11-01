import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseExtensionsComponent } from './browse-extensions.component';

describe('BrowseExtensionsComponent', () => {
  let component: BrowseExtensionsComponent;
  let fixture: ComponentFixture<BrowseExtensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseExtensionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseExtensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
