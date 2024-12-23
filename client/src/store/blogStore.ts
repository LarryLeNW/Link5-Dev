import { create } from "zustand";

interface Post {
  id: string;
  title: string;
  desc: string;
  img?: string;
  views: number;
  userEmail: string;
  catSlug: string;
}

interface BlogState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updatedPost: Partial<Post>) => void;
  deletePost: (id: string) => void;
}

const useBlogStore = create<BlogState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  updatePost: (id, updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, ...updatedPost } : post
      ),
    })),
  deletePost: (id) =>
    set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })),
}));

export default useBlogStore;
