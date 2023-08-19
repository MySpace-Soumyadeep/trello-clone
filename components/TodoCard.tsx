'use client'

import getImageUrl from '@/lib/getImageUrl'
import { useBoardStore } from '@/store/BoardStore'
import { XCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import React,{useState, useEffect} from 'react'
import { Draggable, DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd'

type Props = {
    todo: Todo
    index: number
    id: TypedColumn
    innerRef: (element:HTMLElement | null) => void
    draggableProps: DraggableProvidedDraggableProps
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}
function TodoCard(
    {todo, index, id, innerRef, draggableProps, dragHandleProps}: Props
) {
    const [deleteTodoTask] = useBoardStore((state) => [state.deleteTodoTask])
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    useEffect(() => {
        if(todo.image){
            const fetchImgeUrl =async () => {
                const url = await getImageUrl(todo.image!)
                if(url){
                    setImageUrl(url.toString())
                }
            }
            fetchImgeUrl(); 
        }
      
    }, [todo])
    

  return (
    <div
    className='bg-white rounded-md space-y-2 drop-shadow-md'
    {...dragHandleProps}
    {...draggableProps}
    ref={innerRef}>
        <div className='flex justify-between items-center p-5'>
            <p>{todo.title}</p>
            <button className='text-red-500 hover:text-red-600'
            onClick={() => deleteTodoTask(index, todo, id)}>
                <XCircleIcon className='ml-5 h-8 w-8'/>
            </button>
        </div>
        {
            // image url
            imageUrl && (
                <div className='h-full w-full rounded-b-md'>
                    <Image
                    src={imageUrl}
                    alt="Task Image"
                    width={400}
                    height={200}
                    className='w-full object-contain rounded-b-md'/>
                </div>
            )
        }
    </div>
  )
}

export default TodoCard