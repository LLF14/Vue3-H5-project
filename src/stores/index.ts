import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
export * from './user'
export * from './consult'

const pinia = createPinia()
pinia.use(persist)

export default pinia
