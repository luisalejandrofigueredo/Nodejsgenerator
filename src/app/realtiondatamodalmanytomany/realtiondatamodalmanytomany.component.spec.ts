import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RealtiondatamodalmanytomanyComponent } from './realtiondatamodalmanytomany.component';

describe('RealtiondatamodalmanytomanyComponent', () => {
  let component: RealtiondatamodalmanytomanyComponent;
  let fixture: ComponentFixture<RealtiondatamodalmanytomanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtiondatamodalmanytomanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtiondatamodalmanytomanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
