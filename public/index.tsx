import { store, dispatch, update } from '../src/vertu'

store.on((state, action) => console.log('state : ', state, action))

store.init(
  { count: 10 },
  {
    down(state) {
      return { count: state.count - 1 }
    },
    up: state => ({ count: state.count + 1 }),
    upBy: (state, by) => ({ count: state.count + by }),
  }
)

dispatch('down')

dispatch('upBy', 10)

update('MANUAL', { count: 100 })

const upByFive = state => ({ count: state.count - 5 })

dispatch(upByFive)

const fetchTodos = state =>
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(todos => ({ todos })) // api response goes in state.todos

dispatch(fetchTodos) // state will have `state.todos` after promise is resolved
