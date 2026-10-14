/**
 * GroupNotes - Komponent pre zobrazenie jednej skupiny poznámok (note-group)
 * Každá karta (card) predstavuje jednu skupinu s jej poznámkami
 *
 * Funkcie:
 * - Zobrazenie všetkých poznámok v skupine
 * - Úprava existujúcej poznámky (edit mode)
 * - Pridanie novej poznámky do skupiny
 * - Mazanie poznámky
 *
 * Všetky zmeny sa okamžite ukladajú na server cez DashboardService
 */
import { Component, inject, Inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard-service';

import { NoteGroup } from '../../entities/NoteGroup/NoteGroup';
import { MatMiniFabButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewNoteGroup } from '../dialog-new-note-group/dialog-new-note-group';

@Component({
  selector: 'app-group-notes',
  imports: [MatCardModule, MatIconModule, FormsModule, MatMiniFabButton],
  templateUrl: './group-notes.html',
  styleUrl: './group-notes.css',
})
export class GroupNotes {
  dashboardService = inject(DashboardService);
  dialog = inject(MatDialog);

  @Input({ required: true }) group!: NoteGroup; // Vstupný parameter - skupina poznámok
  @Output() dialogEventListener = new EventEmitter<{ operation: string; noteGroup: NoteGroup }>(); // Event pre okamžitý update UI (emituje NoteGroup s operáciou)

  handleOpenEditDialogWindow(groupId: number) {
    this.dashboardService.getIndividualNoteGroup(groupId).subscribe({
      next: (data) => {
        console.log(data);
        const dialogRef = this.dialog.open(DialogNewNoteGroup, { data });
        dialogRef.afterClosed().subscribe((resultObject) => {
          if (resultObject && resultObject.operation) {
            this.dialogEventListener.emit(resultObject);
          }
          return;
        });
      },
    });
  }

  ngOnInit(): void {
    console.log('GroupNotes component initialized with group:', this.group);
  }
}
