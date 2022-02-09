import {highlightSchemaJevko} from './highlightSchema.js'
import {parseJevko} from 'https://cdn.jsdelivr.net/gh/jevko/parsejevko.js@v0.1.3/mod.js'

console.log(highlightSchemaJevko(parseJevko(`
about [string]
created [float64]
id [string]
karma [float64]
submitted [
  [float64]
array]
object
`)))