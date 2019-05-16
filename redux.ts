class AddTodo {
  constructor(readonly todo: string) { }
}

class CompleteTodo {
  constructor(readonly id: string) { }
}

class RemoveTodo {
  constructor(readonly id: string) { }
}

interface Todo {
  text: string,
  id: string,
  done: boolean,
}

type State = typeof initialState;

const initialState = {
  todos: [] as Todo[],
}

const reducer = (state: State = initialState, action: any): State => {
  if (action instanceof AddTodo) {
    return {
      ...state,
      todos: state.todos.concat({
        text: action.todo,
        id: 'foo',
        done: false,
      }),
    };
  }

  if (action instanceof CompleteTodo) {
    return {
      ...state,
      todos: state.todos.map((item) => item.id === action.id ? { ...item, done: true } : item),
    }
  }

  if (action instanceof RemoveTodo) {
    return {
      ...state,
      todos: state.todos.filter((item) => item.id !== action.id),
    }
  }
  return state;
}