import { Note } from '../Notes/Note';

export class NoteGroup {
  public name?: string;
  public notes?: Note[];
  public id?: number;
  public createdAt?: Date | string;
  constructor() {
    this.notes = [] as Note[];
  }

  get _name(): string | undefined {
    return this.name;
  }
  set _name(value: string) {
    this.name = value;
  }

  get _notes(): Note[] | undefined {
    return this.notes;
  }

  set _notes(value: Note) {
    this.notes?.push(value);
  }

  get _createdAt(): Date | string {
    return this._createdAt;
  }

  static clone(noteGroup: NoteGroup): NoteGroup {
    const name = noteGroup?.name; // Pristúp priamo k property, nie k getterovi
    const id = noteGroup?.id;
    const notes = noteGroup?.notes;
    const createdAt = noteGroup?.createdAt;

    const newNoteGroup = new NoteGroup();
    newNoteGroup.name = name;
    newNoteGroup.id = id;
    newNoteGroup.notes = notes;
    newNoteGroup.createdAt = new Date(createdAt!).toLocaleString('sk-SK');

    return newNoteGroup;
  }
}
