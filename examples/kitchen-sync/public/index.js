import { store, dispatch } from 'vertu'
import '@vertu/devtools' // optionally enable redux devtools

store.init(
  { count: 10 }, // default state
  {
    // actions can just return updated state
    down(state) {
      return { count: state.count - 1 }
    },
    // use arrow functions to define action
    up: state => ({ count: state.count + 1 }),
    // action receives current state as first argument and other parameters next
    upBy: (state, by) => ({ count: state.count + by }),
  }
)

// optionally subscribe to store updates
store.on(state => console.log('state : ', state))

// dispatch an action
dispatch('down')

// dispatch an action with arguments
dispatch('upBy', 5)

// define and dispatch actions outside the store...
const upByFive = state => ({ count: state.count - 5 })
dispatch(upByFive)

// Asunc Actions
const fetchTodos = state =>
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(todos => ({ todos })) // api response goes in state.todos

dispatch(fetchTodos) // state will have `state.todos` after promise is resolved
