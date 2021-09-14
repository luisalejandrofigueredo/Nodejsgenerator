import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallFilesComponent } from './install-files.component';

describe('InstallFilesComponent', () => {
  let component: InstallFilesComponent;
  let fixture: ComponentFixture<InstallFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
