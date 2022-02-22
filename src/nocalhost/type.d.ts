export interface ServerInfo {
  host: string
  email?: string
  password?: string
  token?: string
  uid?: number
}

export type ActionResult = void | {action: string; parameters: unknown}

export type Action = () => Promise<ActionResult>
