type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export function memoSingleton<FN extends (...args: any[]) => Promise<ThenArg<ReturnType<FN>>>>(
  fn: FN,
): (...args: Parameters<FN>) => Promise<ThenArg<ReturnType<FN>>> {
  let _promise: Promise<ThenArg<ReturnType<FN>>>;
  let _result: ThenArg<ReturnType<FN>>;

  return async function runFn(...args) {
    if (_promise == null) {
      _promise = fn(...args)
        .then((result) => {
          _result = result;
          return result;
        })
        .catch((error) => {
          _promise = null;
          throw error;
        });
    }

    return _promise;
  };
}
