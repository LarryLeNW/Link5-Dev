import { create } from "zustand";

interface Category {
  id: string;
  slug: string;
  title: string;
  img?: string;
}

interface CategoryState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}));

export default useCategoryStore;
