import { store, dispatch, update } from '../src/vertu'

store.on(state => console.log('state : ', state))

store.init({ count: 10 }, { up: state => ({ count: state.count + 1 }) })

dispatch('up')()
dispatch('up')()

update('MANUAL', { count: 15 })

dispatch('up')()
dispatch('up')()
