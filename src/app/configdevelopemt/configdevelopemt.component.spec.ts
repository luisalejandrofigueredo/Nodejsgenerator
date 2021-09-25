import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigdevelopemtComponent } from './configdevelopemt.component';

describe('ConfigdevelopemtComponent', () => {
  let component: ConfigdevelopemtComponent;
  let fixture: ComponentFixture<ConfigdevelopemtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigdevelopemtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigdevelopemtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
