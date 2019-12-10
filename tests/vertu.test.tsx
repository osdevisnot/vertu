import { store, dispatch, update } from '../src/vertu'

describe('vertu', () => {
	test('exports', () => {
		expect(store).toBeDefined()
		expect(typeof store).toEqual('object')
		expect(dispatch).toBeDefined()
		expect(typeof dispatch).toEqual('function')
		expect(update).toBeDefined()
		expect(typeof update).toEqual('function')
	})
})
