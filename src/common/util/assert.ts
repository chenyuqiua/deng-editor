import { BugIndicatingError } from '@/page/editor/error/bug-error'

/**
 * Asserts that a condition is `truthy`.
 *
 * @throws provided {@linkcode messageOrError} if the {@linkcode condition} is `falsy`.
 *
 * @param condition The condition to assert.
 * @param messageOrError An error message or error object to throw if condition is `falsy`.
 */
export function assert(
  condition: boolean,
  messageOrError: string | Error = 'unexpected state'
): asserts condition {
  if (!condition) {
    // if error instance is provided, use it, otherwise create a new one
    const errorToThrow =
      typeof messageOrError === 'string'
        ? new BugIndicatingError(`Assertion Failed: ${messageOrError}`)
        : messageOrError

    throw errorToThrow
  }
}
