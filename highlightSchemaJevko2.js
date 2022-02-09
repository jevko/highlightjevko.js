import {trim3, argsToJevko} from 'https://cdn.jsdelivr.net/gh/jevko/jevkoutils.js@v0.1.5/mod.js'

export const highlightSchemaJevko2 = (jevko) => {
  return argsToJevko(...recur(jevko))
}

export const recur = (jevko) => {
  const {subjevkos, suffix} = jevko
  const type = suffix.trim()

  if (['string', 'float64', 'boolean', 'null'].includes(type)) {
    if (subjevkos.length > 0) throw Error('subs > 0 in primitive type')
    return ["span", ["class=", [type], [suffix]]]
  }
  if (type === 'array') return toArray(jevko)
  if (type === 'tuple') return toTuple(jevko)
  if (type === 'first match') return toFirstMatch(jevko)
  if (type === 'object') return toObject(jevko)
  // todo: or infer
  throw Error(`Unknown type (${type})`)
}

const toArray = (jevko) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length !== 1) throw Error('subs !== 1 in array')
  const {prefix, jevko: j} = subjevkos[0]
  if (prefix.trim() !== '') throw Error('empty prefix expected')
  return ["span", ["class=", ["array"], ["["], ...recur(j), ["]"], [suffix]]]//`span[class=[array][\`[]${highlightSchemaJevko(j)}[\`]][${suffix}]]`
}

const toTuple = (jevko) => {
  const {subjevkos, suffix} = jevko
  let ret = []
  for (const {prefix, jevko} of subjevkos) {
    ret.push(prefix, ["["], ...recur(jevko), ["]"]) //`${prefix}[\`[]${highlightSchemaJevko2(jevko)}[\`]]`
  }
  return ["span", ["class=", ["tuple"], ...ret, [suffix]]] //`span[class=[tuple]${ret}[${suffix}]]`
}

const toFirstMatch = (jevko) => {
  const {subjevkos, suffix} = jevko
  let ret = []
  for (const {prefix, jevko} of subjevkos) {
    ret.push(prefix, ["["], ...recur(jevko), ["]"])
    // ret += `${prefix}[\`[]${highlightSchemaJevko2(jevko)}[\`]]`
  }
  return ["span", ["class=", ["firstMatch"], ...ret, [suffix]]]//`span[class=[firstMatch]${ret}[${suffix}]]`
}

const toObject = (jevko) => {
  const {subjevkos, suffix} = jevko

  let ret = []
  for (const {prefix, jevko} of subjevkos) {
    const [pre, mid, post] = trim3(prefix)
    ret.push(pre, "span", ["class=", ["key"], [mid]], post, ["["], ...recur(jevko), ["]"])
    // ret += `${pre}span[class=[key][${mid}]]${post}[\`[]${recur(jevko)}[\`]]` //[key] = jevkoToSchema(jevko)
  }

  return ["span", ["class=", ["object"], ...ret, [suffix]]]
  // return `span[class=[object]${ret}[${suffix}]]`
}