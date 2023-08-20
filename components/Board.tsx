'use client'

import { useBoardStore } from '@/store/BoardStore';
import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

function Board() {
  const [board, getBoard, setBoard, updateTodoInDB] = useBoardStore((state) => [state.board, state.getBoard, state.setBoard, state.updateTodoInDB])

  useEffect(() => {
    getBoard();
    
  }, [getBoard])

  const handleDragEnd = (result : DropResult) => {
    const {destination, source, type} = result
    // console.log( {destination, source, type});
    
    // if outside the box
    if(!destination) return

    if(type == "column"){
      const entries = Array.from(board.columns.entries())
      const [removed] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, removed)
      const rearrangedColumn = new Map(entries)
      setBoard({...board, columns: rearrangedColumn})
    }
    else{
      const columns = Array.from(board.columns)
      const startColumnIndex = columns[Number(source.droppableId)]
      const endColumnIndex = columns[Number(destination.droppableId)]
  
      console.log({columns, startColumnIndex, endColumnIndex});
      
      const startColumn: Column = {
        id:startColumnIndex[0],
        todos: startColumnIndex[1].todos
      }
  
      const endColumn: Column = {
        id:endColumnIndex[0],
        todos: endColumnIndex[1].todos
      }
      
      if(!startColumn || !endColumn) return;
      if(source.index == destination.index && startColumn == endColumn) return;
  
      const newTodos = startColumn.todos
      const [movedTodo] = newTodos.splice(source.index, 1)
  
  
      if(startColumn.id == endColumn.id){
      // dragged in same column
      newTodos.splice(destination.index, 0, movedTodo)
      const newColumn = {
        id: startColumn.id,
        todos: newTodos
      }
      const tempColumns = new Map(board.columns)
      tempColumns.set(startColumn.id, newColumn)
      setBoard({...board, columns: tempColumns}) 
      }
      else{
        // dragged in different column
        const destTodos = Array.from(endColumn.todos)
        destTodos.splice(destination.index, 0, movedTodo)
  
        const newColumn_src = {
          id: startColumn.id,
          todos: newTodos
        }
        const newColumn_dest = {
          id: endColumn.id,
          todos: destTodos
        }
        const tempColumns = new Map(board.columns)
        tempColumns.set(startColumn.id, newColumn_src)
        tempColumns.set(endColumn.id, newColumn_dest)

        // update in db
        updateTodoInDB(movedTodo, endColumn.id)
        setBoard({...board, columns: tempColumns})
      }
  
    }
   
  }
  
  
  return <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId='board' direction='horizontal' type="column">
        {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto px-2'>
              {
                 Array.from(board.columns.entries()).map(([id, columns], index) => {
                  
                  return (
                  <Column 
                  key={id}
                  id={id}
                  todos={columns?.todos}
                  index={index}
                  />)
                })
              }
            </div>
        )}
    </Droppable>
  </DragDropContext>
}

export default Board