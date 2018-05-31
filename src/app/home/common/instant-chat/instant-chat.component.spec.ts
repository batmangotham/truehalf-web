import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantChatComponent } from './instant-chat.component';

describe('InstantChatComponent', () => {
  let component: InstantChatComponent;
  let fixture: ComponentFixture<InstantChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
