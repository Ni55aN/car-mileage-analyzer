import { loadPageRecords as autoRia } from './auto-ria'
import { loadPageRecords as rst } from './rst'

const providers = { rst, autoRia }

export type Providers = 'rst' | 'autoRia'

export function loadPageRecords(provider: Providers, page: number) {
  return providers[provider](page)
}