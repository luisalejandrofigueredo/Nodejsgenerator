import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseControllersComponent } from './browse-controllers.component';

describe('BrowseControllersComponent', () => {
  let component: BrowseControllersComponent;
  let fixture: ComponentFixture<BrowseControllersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseControllersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseControllersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
