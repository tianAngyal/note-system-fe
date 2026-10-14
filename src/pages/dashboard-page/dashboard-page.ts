/**
 * DashboardPage - Hlavná stránka aplikácie
 * Tu sa zobrazujú všetky skupiny poznámok (note-groups) používateľa
 * Stránka je chránená AuthGuard-om - dostanú sa sem len prihlásení
 *
 * Obsahuje:
 * - Navbar (horné menu s logout tlačidlom)
 * - Filter panel (ľavá strana)
 * - Hlavná časť s note-groups (pravá strana)
 * - Tlačidlo na vytvorenie novej skupiny poznámok
 *
 * Ak používateľ NIE JE prihlásený, nezobrazí sa obsah (note-groups)
 */
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../services/dashboard-service';
import { Navbar } from '../../components/navbar/navbar';
import { MatIconModule } from '@angular/material/icon';
import { GroupNotes } from '../../components/group-notes/group-notes';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogNewNoteGroup } from '../../components/dialog-new-note-group/dialog-new-note-group';
import { UserManagement } from '../../services/user-management';
import { NoteGroup } from '../../entities/NoteGroup/NoteGroup';
import { MatCheckbox } from '@angular/material/checkbox';

export interface Filter {
  name: string;
  tickedAll: boolean;
  tickedPartially: { name: string; completed: boolean }[];
}

@Component({
  selector: 'app-dashboard-page',
  imports: [
    MatCardModule,
    Navbar,
    MatIconModule,
    GroupNotes,
    MatButtonModule,
    DialogNewNoteGroup,
    MatCheckbox,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  dashboardService = inject(DashboardService);
  userManagement = inject(UserManagement);
  dashboardData = signal<NoteGroup[]>([]);
  dialog = inject(MatDialog);

  timeFilter = signal<Filter | undefined>(undefined);

  openDialog() {
    const dialogRef = this.dialog.open(DialogNewNoteGroup);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);

      if (result && result !== false && result.operation === 'create') {
        const currentData = this.dashboardData();
        if (currentData && Array.isArray(currentData)) {
          const updatedData = [...currentData, NoteGroup.clone(result.noteGroup)];
          this.dashboardData.set(updatedData);
          this.getTimeFilters();
          // console.log('New group added to dashboard:', result.noteGroup);
        }
      }
    });
  }

  onDialogEventListener(result: any): void {
    this.loadDashboardData();
  }

  isLoggedIn(): boolean {
    return this.userManagement.isLoggedIn();
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      console.log('načitavam data zo servera...');
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.getTimeFilters();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      },
    });
  }

  formatTimestamp(array: string[]): string[] {
    return array.map((string) => new Date(string).toLocaleString('sk-SK'));
  }

  getTimeFilters(): void {
    this.dashboardService.getTimeStampFilter().subscribe({
      next: (returnedData) => {
        // console.log(returnedData);
        const formattedData = this.formatTimestamp(returnedData);
        this.timeFilter.set({
          name: 'time',
          tickedAll: true,
          tickedPartially: formattedData.map((timeStamp: string) => ({
            name: timeStamp,
            completed: true,
          })),
        });
        // this.filterTimeValues.set(returnedData);
        console.log(this.timeFilter());
      },
    });
  }

  partiallyComplete = computed(() => {
    const timeFilter = this.timeFilter();

    if (!timeFilter?.tickedPartially) {
      return false;
    }
    return (
      timeFilter.tickedPartially.some((t) => t.completed) &&
      !timeFilter.tickedPartially.every((t) => t.completed)
    );
  });

  update(completed: boolean, index?: number) {
    this.timeFilter.update((filter) => {
      if (!filter) return filter;

      if (index === undefined && filter) {
        filter.tickedAll = completed;
        filter.tickedPartially?.forEach((t) => (t.completed = completed));
        // console.log('Kliknutý "Select All"');
      } else {
        filter.tickedPartially[index!].completed = completed;
        filter.tickedAll = filter.tickedPartially?.every((t) => t.completed) ?? true;
        // console.log(`Kliknutý checkbox: ${filter.tickedPartially[index!].name}`);
      }
      return { ...filter };
    });
  }

  filteredData = computed(() => {
    const filters = this.timeFilter();
    const data = this.dashboardData();

    console.log('ked updatujem data', data);

    const activeTimestamps = new Set(
      filters?.tickedPartially.filter((items) => items.completed).map((item) => item.name),
    );

    return data.filter((item) => {
      return activeTimestamps.has(item.createdAt as string);
    });
  });

  keysOf(obj: any): string[] {
    return Object.keys(obj);
  }
}
