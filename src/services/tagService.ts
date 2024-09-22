import { Tag } from "@/types/tags";
import {api, handleApiError} from '@/services/api'
import {getAccessToken} from "@/services/authService";
import {GetServerSidePropsContext} from "next";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchTags = async (page: number = 1, search: string = "", ctx?: GetServerSidePropsContext): Promise<PaginatedResponse<Tag>> => {
  try {
    const token = ctx ? getAccessToken(ctx) : getAccessToken(); // Use SSR token if available

    const params: any = { page };

    if (search) {
      params.search = search;
    }

    const response = await api.get<PaginatedResponse<Tag>>('/tags', {
      params,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch tags");
  }
};
export const createTag = async (data: Partial<Tag>): Promise<Tag> => {
  try {
    const token = getAccessToken();
    const response = await api.post<Tag>('/tags', data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to create tag");
  }
};

export const updateTag = async (id: number, data: Partial<Tag>): Promise<Tag> => {
  try {
    const token = getAccessToken();
    const response = await api.put<Tag>(`/tags/${id}`, data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to update tag");
  }
};

export const patchTag = async (id: number, data: Partial<Tag>): Promise<Tag> => {
  try {
    const token = getAccessToken();
    const response = await api.patch<Tag>(`/tags/${id}`, data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to partially update tag");
  }
};

export const deleteTag = async (id: number): Promise<void> => {
  try {
    const token = getAccessToken();
    await api.delete(`/tags/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to delete tag");
  }
};
