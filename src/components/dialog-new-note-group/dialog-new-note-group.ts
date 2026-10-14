/**
 * DialogNewNoteGroup - Dialog (popup okno) pre vytvorenie novej skupiny poznámok
 * Zobrazí sa po kliknutí na tlačidlo "Create Note Group" v dashboarde
 *
 * V dialógu používateľ zadá názov novej skupiny poznámok
 * Po potvrdení sa skupina vytvorí na serveri a pridá sa do zoznamu
 */
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCard, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DashboardService } from '../../services/dashboard-service';
import { NoteGroup } from '../../entities/NoteGroup/NoteGroup';
import { Note } from '../../entities/Notes/Note';
import { MessageService } from '../../services/message-service';
import { GroupNotes } from '../group-notes/group-notes';

@Component({
  selector: 'app-dialog-new-note-group',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-new-note-group.html',
  styleUrl: './dialog-new-note-group.scss',
})
export class DialogNewNoteGroup implements OnInit {
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  dialogRef = inject(MatDialogRef<DialogNewNoteGroup>);
  data = inject<NoteGroup | null>(MAT_DIALOG_DATA);
  dashboardService = inject(DashboardService);
  messageService = inject(MessageService);

  noteGroup: NoteGroup = new NoteGroup();
  notes: Note[] = [];

  formModel = new FormGroup({
    groupName: new FormControl('', Validators.required),
    notes: new FormArray<FormControl<string>>([]),
  });
  ngOnInit(): void {
    console.log(this.data);
    if (this.data) {
      this.data.notes?.forEach((note) => {
        this.formModel.controls.notes.push(this.createNoteFormGroup(note));
        this.notes.push(note);
      });

      this.formModel.patchValue({
        groupName: this.data.name,
      });
    }

    this.formModel.valueChanges.subscribe((val) => {
      this.formModel.controls.notes.controls.forEach((control, index) => {
        if (this.notes[index]) {
          this.notes[index].content = control.value;
        }
      });
    });
  }

  createNoteFormGroup(note: Note): FormControl<string> {
    return new FormControl<string>(note.content || '', {
      nonNullable: true,
      validators: Validators.required,
    });
  }

  handleAddNoteField() {
    const newNote = new Note();
    this.notes.push(newNote);
    this.formModel.controls.notes.push(this.createNoteFormGroup(newNote));

    setTimeout(() => {
      const scrollEl = this.inputRef.nativeElement.closest('mat-dialog-content');
      if (scrollEl) {
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }
    }, 0);
  }

  onSubmit() {
    this.formModel.markAllAsTouched();

    if (this.formModel.invalid) {
      return;
    } else {
      console.log('formular je bez chyb.');

      this.noteGroup.name = this.formModel.get('groupName')?.value!;
      this.notes.forEach((note) => (this.noteGroup._notes = note));

      if (this.data === null) {
        this.dashboardService.createNoteGroup(this.noteGroup).subscribe({
          next: (newGroup) => {
            this.messageService.printInfo('New NoteGroup successfully created!');
            this.closeDialog({ operation: 'create', noteGroup: newGroup });
          },
        });
      } else {
        this.noteGroup.id = this.data.id;

        this.dashboardService.updateNoteGroup(this.noteGroup).subscribe({
          next: (updatedNoteGroup) => {
            this.messageService.printInfo(
              `NoteGroup ${updatedNoteGroup.id} has been successfully updated!`,
            );
            this.closeDialog({ operation: 'update', noteGroup: updatedNoteGroup });
          },
        });

        // console.log(this.noteGroup);
      }
    }
  }
  closeDialog(data: { operation: string; noteGroup: NoteGroup } | boolean) {
    this.dialogRef.close(data);
  }

  deleteNoteRow(index: number) {
    if (index >= 0 && index < this.notes.length) {
      this.notes = this.notes.filter((_, i) => i !== index);
      this.formModel.controls.notes.removeAt(index);
    }
  }

  handleDeleteNoteGroup(data: NoteGroup) {
    if (this.notes != null) {
      this.dashboardService.deleteNoteGroup(data).subscribe({
        next: (noteGroup) => {
          this.messageService.printInfo(`NoteGroup ${noteGroup.id} has been successfully deleted!`);
          this.closeDialog({ operation: 'delete', noteGroup: noteGroup });
        },
      });
    }
  }

  get groupName() {
    return this.formModel.get('groupName');
  }
  get formModelNotes() {
    return this.formModel.get('notes');
  }
}
