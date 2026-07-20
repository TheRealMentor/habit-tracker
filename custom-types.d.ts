declare module 'custom-env' {
  export function env(mode?: string, path?: string): void
}

declare module 'morgan' {
  export default function morgan(env: string, options?: any): any
}
