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

  /** Remember to clear the event listener when lifecycle finish.(e.g. react useEffect unmount) */
  onStateChange(listener: (data: T, preData: T) => void) {
    const dispose = this.store.subscribe(listener)
    return () => {
      dispose()
    }
  }
}
