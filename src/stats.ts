export const listenerStats: Map<string, number> = new Map()

export function listenerIncr(name: string): void {
  listenerStats.set(name, listenerStats.get(name) ?? 0 + 1)
}

export function listenerDecr(name: string): void {
  listenerStats.set(name, listenerStats.get(name) ?? 0 - 1)
}
