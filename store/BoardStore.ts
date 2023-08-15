import { database } from '@/appwrite';
import { getTodosGroupByColumn } from '@/lib/getTodosGroupByColumn';
import { create } from 'zustand'

interface BoardState {
    board: Board
    getBoard: () => void;
    setBoard: (board: Board) => void;
    updateTodoInDB: (todo:Todo, columnId: TypedColumn) => void;
    searchString: string;
    setSearchString:(searchString: string) => void
  }

export const useBoardStore = create<BoardState>((set) => ({
 board: {
    columns: new Map<TypedColumn, Column>()
 },
  getBoard: async() => {
    const board = await getTodosGroupByColumn();
    set({board})
  },
  setBoard: (board) => set({board}),
  updateTodoInDB:async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
      todo.$id,
      {
        title: todo.title,
        status: columnId
      }
    )
  },
  searchString:"",
  setSearchString:(searchString) => set({searchString})
}))