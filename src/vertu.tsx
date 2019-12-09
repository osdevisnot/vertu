/************************************************************
 *    vertu : super minimal vanilla js state container      *
 *          |                             ^                 *
 *          | dispatch                    | subscriptions   *
 *          v                             |                 *
 *    +-------------+               +------------+          *
 *    |             |               |            |          *
 *    |   actions   ---------------->   state    |          *
 *    |             |   updates     |            |          *
 *    +-------------+               +------------+          *
 ************************************************************/

let merge = (a, b) => Object.assign({}, a, b)

let _state = {},
	_actions = {},
	_events = []

let update = (action, state) => {
	_state = merge(_state, state)
	_events.map(handler => handler(_state, action))
}

let store = {
	off(handler) {
		_events.splice(_events.indexOf(handler) >>> 0, 1)
	},
	on(handler) {
		_events.push(handler)
		return store.off.bind(store, handler)
	},
	get state() {
		return _state
	},
	init(state, actions) {
		_state = merge(_state, state)
		_actions = merge(_actions, actions)
	},
}

let dispatch = (action, ...payload) => {
	let result
	if (typeof action === 'string' && _actions[action]) {
		result = _actions[action](_state, ...payload)
	} else {
		result = action(_state, ...payload)
	}
	if (result) {
		if (result.then) {
			return result.then(response => update(action, response))
		}
		return update(action, result)
	}
}

export { store, dispatch, update }
