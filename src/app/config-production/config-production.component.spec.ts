import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigProductionComponent } from './config-production.component';

describe('ConfigProductionComponent', () => {
  let component: ConfigProductionComponent;
  let fixture: ComponentFixture<ConfigProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
