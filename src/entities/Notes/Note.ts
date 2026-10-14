/**
 * Note - Dátová trieda pre jednu poznámku
 * Obsahuje:
 * - id: Unikátne ID poznámky (pridelené serverom)
 * - content: Textový obsah poznámky
 */
export class Note {
  public content?: string;
  public id?: number;
  constructor() {}

  get _content(): string {
    return this.content!;
  }

  set _content(value: string) {
    this.content = value;
  }
}
