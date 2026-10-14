import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupNotes } from './group-notes';

describe('GroupNotes', () => {
  let component: GroupNotes;
  let fixture: ComponentFixture<GroupNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
