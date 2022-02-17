import {escape, jevkoToString} from 'https://cdn.jsdelivr.net/gh/jevko/jevkoutils.js@0.1.6/mod.js'
import {jevkoBySchemaToVerified} from 'https://cdn.jsdelivr.net/gh/jevko/jevkoschema.js@0.2.0/mod.js'

export const jevkoBySchemaToHtml = (jevko, schema) => {
  const verified = jevkoBySchemaToVerified(jevko, schema)
  return recur(verified)
}

const recur = (verified) => {
  const {schema, jevko} = verified
  const {type} = schema
  const {subjevkos, suffix} = jevko

  if (subjevkos.length === 0) return `<span class="${type}">${escape(suffix)}</span>`

  if (type === 'object') return toObject(verified)
  return toArrayOrTuple(verified)
}

const toObject = (verified) => {
  const {items, jevko} = verified
  const {subjevkos, suffix} = jevko
  let ret = ''
  for (let i = 0; i < subjevkos.length; ++i) {
    const {prefix, jevko} = subjevkos[i]
    const {ignored, value, key, pre, post} = items[i]
    if (ignored === true) {
      ret += `<span class="ignored">${escape(prefix)}[${jevkoToString(jevko)}]</span>`
    } else {
      ret += `<span class="item">${pre}<span class="key">${escape(key)}</span>${post}[<span class="value">${recur(value)}</span>]</span>`
    }
  }

  return `<span class="${ret === ''? 'empty ': ''}object">${ret}${suffix}</span>`
}

const toArrayOrTuple = (verified) => {
  const {schema, jevko, items} = verified
  const {subjevkos, suffix} = jevko
  const {type} = schema
  let ret = ''
  for (let i = 0; i < subjevkos.length; ++i) {
    const {jevko} = subjevkos[i]
    const {ignored, value, prefix} = items[i]
    if (ignored === true) {
      ret += `<span class="ignored">${escape(prefix)}[${jevkoToString(jevko)}]</span>`
    } else {
      ret += `<span class="item">${escape(prefix)}[${recur(value)}]</span>`
    }
  }

  return `<span class="${ret === ''? 'empty ': ''}${type}">${ret}${suffix}</span>`
}
