import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadphotoComponent } from './uploadphoto.component';

describe('UploadphotoComponent', () => {
  let component: UploadphotoComponent;
  let fixture: ComponentFixture<UploadphotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadphotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadphotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
