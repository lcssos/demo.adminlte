import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenslideComponent } from './openslide.component';

describe('OpenslideComponent', () => {
  let component: OpenslideComponent;
  let fixture: ComponentFixture<OpenslideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenslideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenslideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
