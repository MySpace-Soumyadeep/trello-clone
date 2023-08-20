import { database } from "@/appwrite"

export const getTodosGroupByColumn = async() => {
    const data = await database.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!)

    const todos = data.documents;

    const columns = todos.reduce((acc, todo) => {
        
        if(!acc.get(todo.status)){
            acc.set(todo.status, {
                id: todo.status,
                todos:[]
            })
        }
        acc.get(todo.status)!.todos.push({
            $id:todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            ...(todo.image && { image: JSON.parse(todo.image)})
        })

        return acc;
    }, new Map<TypedColumn, Column>)


    // if columns do noot have inprogress todo or done, add empty array to todo

    const colType: TypedColumn[]=["todo","inprogress","done"]

    for(const col of colType){
        if(!columns.get(col)){
            columns.set(col, {
                id: col,
                todos:[]
            })
        }
    }
console.log({columns});

    // sort columns

    // const sortedColumns = new Map([...columns.entries()].sort((a,b) => colType.indexOf(a[0]) - colType.indexOf(b[0])))
    const sortedColumns = new Map(Array.from(columns.entries()).sort((a,b) => colType.indexOf(a[0]) - colType.indexOf(b[0])))
    console.log({sortedColumns});
    

    const board: Board = {
        columns: sortedColumns
    }

    return board;
    
}