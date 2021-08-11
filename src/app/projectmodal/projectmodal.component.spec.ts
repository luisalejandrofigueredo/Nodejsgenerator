import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectmodalComponent } from './projectmodal.component';

describe('ProjectmodalComponent', () => {
  let component: ProjectmodalComponent;
  let fixture: ComponentFixture<ProjectmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
