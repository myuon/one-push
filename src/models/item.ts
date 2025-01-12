export class Item {
  id: string;
  room_id: string;
  item_type: string;
  mime_type: string;
  summary: string;
  created_at: number;
  updated_at: number;

  constructor(
    id: string,
    room_id: string,
    item_type: string,
    mime_type: string,
    summary: string,
    created_at: number,
    updated_at: number
  ) {
    this.id = id;
    this.room_id = room_id;
    this.item_type = item_type;
    this.mime_type = mime_type;
    this.summary = summary;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
