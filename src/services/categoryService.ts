import { Category } from "@/types/category";
import {api, handleApiError} from '@/services/api'
import {getAccessToken} from "@/services/authService";
import {GetServerSidePropsContext} from "next";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Fetch paginated categories
export const fetchCategories = async (
  page: number = 1,
  search?: string,
  ctx?: any
): Promise<PaginatedResponse<Category>> => {
  try {
    // If context is provided (SSR), use it; otherwise, do a client-side request
    const token = ctx ? getAccessToken(ctx) : getAccessToken();

    // Build query params, including the search parameter if it's provided
    const params: any = { page };

    // Add search query parameter if provided (non-empty string)
    if (search) {
      params.search = search;
    }

    const response = await api.get<PaginatedResponse<Category>>('/categories', {
      params, // Include page and search (if applicable) in the params
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch categories");
  }
};


// Create a new category
export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  try {
    const token = getAccessToken();
    const response = await api.post<Category>('/categories/', data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to create category");
  }
};

// Update a category (full update)
export const updateCategory = async (id: number, data: Partial<Category>): Promise<Category> => {
  try {
    const token = getAccessToken();
    const response = await api.put<Category>(`/categories/${id}/`, data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to update category");
  }
};

// Partially update a category (patch)
export const patchCategory = async (id: number, data: Partial<Category>): Promise<Category> => {
  try {
    const token = getAccessToken();
    const response = await api.patch<Category>(`/categories/${id}`, data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to partially update category");
  }
};

// Delete a category
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const token = getAccessToken();
    await api.delete(`/categories/${id}/`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to delete category");
  }
};