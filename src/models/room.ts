export class Room {
  id: string;
  created_at: number;
  updated_at: number;

  constructor(id: string, created_at: number, updated_at: number) {
    this.id = id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
