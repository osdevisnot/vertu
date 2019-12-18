import { dispatch, store, update } from '../src/vertu'

const sleep = ms => new Promise(r => setTimeout(r, ms))

describe('store', () => {
  let fn
  let fn2
  beforeEach(() => {
    fn = jest.fn()
    fn2 = jest.fn()
  })
  test('exports', () => {
    expect(store).toBeDefined()
    expect(typeof store).toEqual('object')
    expect(dispatch).toBeDefined()
    expect(typeof dispatch).toEqual('function')
    expect(update).toBeDefined()
    expect(typeof update).toEqual('function')
  })
  test('add handler', () => {
    const unsub = store.on(fn)
    expect(unsub).toBeDefined()
    expect(typeof unsub).toEqual('function')
  })
  test('get state when registered', () => {
    store.init({ count: 0 }, {})
    expect(store.state).toEqual({ count: 0 })
  })
  test('dispatch action', () => {
    store.init(
      { count: 10 },
      {
        up: state => ({ count: state.count + 1 }),
      }
    )
    dispatch('up')
    expect(store.state).toEqual({ count: 11 })
  })
  test('stops calling listeners if unsubscribed', () => {
    const handler = store.on(fn2)
    dispatch('up')
    expect(fn2).toHaveBeenCalledTimes(1)
    expect(fn2).toBeCalledWith({ count: 12 }, 'up')
    handler()
    dispatch('up')
    expect(fn2).toHaveBeenCalledTimes(1)
  })
  test('update state', () => {
    store.init(
      { count: 10 },
      {
        up: state => ({ count: state.count + 1 }),
      }
    )
    update('MANUAL', { count: 11 })
    expect(store.state).toEqual({ count: 11 })
  })
  test('dispatch action with payload', () => {
    store.init(
      {
        count: 10,
      },
      {
        downBy: (state, sub) => ({ count: state.count - sub }),
      }
    )
    dispatch('downBy', 5)
    expect(store.state).toEqual({ count: 5 })
  })

  test('dispatch async actions', async () => {
    store.init(
      {},
      {
        fetch: () => {
          return new Promise((resolve, reject) => {
            process.nextTick(() => {
              resolve({ name: 'async' })
            })
          })
        },
      }
    )
    dispatch('fetch')
    await sleep(1)
    expect(store.state).toEqual({ count: 5, name: 'async' })
  })
  test('wont dispatch unknown actions', () => {
    dispatch('unknown')
    expect(store.state).toEqual({ count: 5, name: 'async' })
  })
  test('wont change state if action returns undefined', () => {
    store.init({ count: 10 }, { up: _ => undefined })
    expect(store.state).toEqual({ count: 10, name: 'async' })
    dispatch('up')
    expect(store.state).toEqual({ count: 10, name: 'async' })
  })
  test('dispatch fn actions', () => {
    store.init({ count: 11 })
    const down = state => ({ count: state.count - 1 })
    dispatch(down)
    expect(store.state).toEqual({ count: 10, name: 'async' })
  })
})
