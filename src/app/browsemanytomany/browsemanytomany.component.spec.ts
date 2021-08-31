import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowsemanytomanyComponent } from './browsemanytomany.component';

describe('BrowsemanytomanyComponent', () => {
  let component: BrowsemanytomanyComponent;
  let fixture: ComponentFixture<BrowsemanytomanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsemanytomanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsemanytomanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
