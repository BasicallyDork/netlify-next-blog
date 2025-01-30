import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { blog } from './blog'
import { comment } from './comment'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author,blog, comment],
}
