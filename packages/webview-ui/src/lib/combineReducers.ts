export type Reducer<S, A> = (state: S, action: A) => S;

export function CombineReducers<S, A>(...reducers: Reducer<S, unknown>[]): Reducer<S, A> {
  return (state, action) => reducers.reduce((acc, reducer) => reducer(acc, action), state);
}
