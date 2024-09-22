import {Note, NoteHistory} from "@/types/notes";
import {api, handleApiError} from '@/services/api'
import {getAccessToken} from "@/services/authService";
import {GetServerSideProps, GetServerSidePropsContext, NextPageContext} from "next";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchNotes = async (page:number = 1,): Promise<PaginatedResponse<Note>> => {
  try {
    const token = getAccessToken();
    const response = await api.get<PaginatedResponse<Note>>('/notes', {
      params: {
        page,
      },
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch notes");
  }
};


export const fetchNote = async (slug: string, ctx?: GetServerSidePropsContext): Promise<Note> => {
  try {
    const token = ctx ? getAccessToken(ctx) : getAccessToken();
    console.log("token: ", token);
    const response = await api.get<Note>(`/notes/${slug}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch notes");
  }
};

export const toggleFavorite = async (id: number): Promise<Note> => {
  const token = getAccessToken();
  try {
    const response = await api.post<Note>(`/notes/${id}/toggle_favorite/`, {}, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to toggle favorite');
  }
};

interface UpdatedNoteData {
  title: string;
  content: string;
  category: number;
  tags: number[];
  is_favorite: boolean;
}

export const updateNote = async (id: number, updatedNoteData: UpdatedNoteData, ctx?:any): Promise<Note> => {
  const token = ctx ? getAccessToken(ctx) : getAccessToken();
  try {
    const response = await api.put<Note>(`/notes/${id}/`, updatedNoteData, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to update the note.");
  }
};

export const fetchNoteHistory = async (slug: any, ctx?:any): Promise<PaginatedResponse<NoteHistory>> => {
  try {
    const token = ctx ? getAccessToken(ctx) : getAccessToken();
    const response = await api.get<PaginatedResponse<NoteHistory>>(`/notes/${slug}/history/`, {
      params: {
      },
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    handleApiError(error); // Lida com erros da API
    throw new Error("Failed to fetch note history");
  }
};