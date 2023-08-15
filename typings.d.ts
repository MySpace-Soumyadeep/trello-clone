interface Board {
    columns: Map<TypedColumn, Column>
}


type TypedColumn = "todo" | "inprogress" | "done"

interface Column {
    id: TypedColumn,
    todos: Todo[]
}

interface Todo {
    $id: string;
    $createdAt: string;
    title: string;
    image?: Image;
    status: TypedColumn;
}

interface Image{
    bucketId: string;
    fileID: string;
}