import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseonetooneComponent } from './browseonetoone.component';

describe('BrowseonetooneComponent', () => {
  let component: BrowseonetooneComponent;
  let fixture: ComponentFixture<BrowseonetooneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseonetooneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseonetooneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
