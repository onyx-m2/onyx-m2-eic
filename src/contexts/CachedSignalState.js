import { useEffect } from 'react'
import { useSignalState } from 'onyx-m2-react'

const cache = {}

/**
 * A version of useSignalState that saves the current state in memory and
 * even persist values across reloads using local storage.
 * This is intended to speedup showing indicator values when simply flipping
 * through displays. (That is, it hide the broadcast period of the requested
 * message.) Another use case is to speedup display of values that don't change
 * frequently and thus may not update quickly, for example, SoC.
* @param {*} mnemonic
 * @param {*} initialValue
 * @returns
 */
export function useCachedSignalState(mnemonic, initialValue) {
  const value = useSignalState(mnemonic, lookup(mnemonic, initialValue))
  useEffect(() => {
    cache[mnemonic] = value
    return () => {
      localStorage.setItem(mnemonic, value)
    }
  }, [mnemonic, value])
  return value
}

function lookup(mnemonic, initialValue) {
  let value = cache[mnemonic]
  if (value !== undefined) {
    return value
  }
  value = localStorage.getItem(mnemonic)
  if (value !== null) {
    return parseFloat(value)
  }
  return initialValue
}