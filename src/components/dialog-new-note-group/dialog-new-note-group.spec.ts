import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewNoteGroup } from './dialog-new-note-group';

describe('DialogNewNoteGroup', () => {
  let component: DialogNewNoteGroup;
  let fixture: ComponentFixture<DialogNewNoteGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogNewNoteGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNewNoteGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
