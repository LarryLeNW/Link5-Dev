import { create } from "zustand";

interface Comment {
  id: string;
  desc: string;
  createdAt: string;
  userEmail: string;
  postSlug: string;
}

interface CommentState {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  deleteComment: (id: string) => void;
}

const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),
  deleteComment: (id) =>
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== id),
    })),
}));

export default useCommentStore;
