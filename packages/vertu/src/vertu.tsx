/************************************************************
 *       vertu : minimal vanilla js state container         *
 *          |                             ^                 *
 *          | dispatch                    | subscriptions   *
 *          v                             |                 *
 *    +-------------+               +------------+          *
 *    |             |               |            |          *
 *    |   actions   ---------------->   state    |          *
 *    |             |   updates     |            |          *
 *    +-------------+               +------------+          *
 ************************************************************/

export type State = Record<string, any>
export type Action = (
  state: State,
  ...payload: any[]
) => State | Promise<State> | void
export type Actions = Record<string, Action>
export type Subscription = (state: State, action: string | Action) => unknown

let EMPTY_OBJECT = {}

let merge = (a, b) => Object.assign({}, a, b)

let _state: State = {},
  _actions: Actions = {},
  _events: Subscription[] = []

let update = (action: string | Action, state: State) => {
  _state = merge(_state, state)
  _events.map(handler => handler(_state, action))
}

let off = (idx: number): void => {
  _events.splice(idx, 1)
}

let store = {
  on(handler: Subscription): () => void {
    let idx = _events.push(handler)
    return off.bind(EMPTY_OBJECT, idx - 1)
  },
  get state(): State {
    return _state
  },
  init(state: State, actions: Actions = EMPTY_OBJECT) {
    _state = merge(_state, state)
    _actions = merge(_actions, actions)
  },
}

let dispatch = (action: string | Action, ...payload) => {
  let result
  if (typeof action === 'string') {
    if (_actions[action]) {
      result = _actions[action](_state, ...payload)
    }
  } else {
    result = action(_state, ...payload)
  }
  if (result) {
    if (result.then) {
      return result.then((response: Record<string, any>) =>
        update(action, response)
      )
    }
    return update(action, result)
  }
}

export { store, dispatch, update }
