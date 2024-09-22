import {Tag} from '@/types/tags'

export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  user: number;
  is_favorite: boolean;
  slug: string;
}

export interface NoteHistory {
  history_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  history_date: string;
  history_change_reason: string | null;
  history_type: string;
  history_user_id: number;
}
