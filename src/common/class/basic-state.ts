import { produce } from 'immer'
import { createStore } from 'zustand'

export class BasicState<T extends object> {
  readonly store = createStore<T>(() => ({}) as T)

  constructor(initialState: T) {
    this.store.setState(initialState)
  }

  get state() {
    return this.store.getState()
  }

  setState(updater: (state: T) => void) {
    this.store.setState(produce(this.state, updater))
  }
}
