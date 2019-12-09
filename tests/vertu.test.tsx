import { dispatch } from '../src/vertu'

describe('vertu', () => {
	test('exports', () => {
		expect(dispatch).toBeDefined()
		expect(typeof dispatch).toEqual('function')
	})
})
