
/**
 * @param { Function[] } fns
 * @returns { function(Object) : Promise<Object> }
 */
export default (...fns) => (x = {}) => (
  fns.reduce(async (y, f) => f(await y), x)
)
