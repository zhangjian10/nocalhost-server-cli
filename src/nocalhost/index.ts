import axios, { AxiosResponse } from 'axios'
import user from './user'
import { ServerInfo } from './type'
import assert from 'assert'
import * as devSpace from './devSpace'

interface Response {
  code: number
  message: string
  data: unknown
}

export class NocalhostServe {
  private token?: string

  private constructor(private info: ServerInfo) {
    const api = axios.create({ baseURL: info.host })

    api.interceptors.request.use(async config => {
      config.headers = config.headers ?? {}

      if (this.token) {
        config.headers['authorization'] = 'Bearer ' + this.token
      }

      return config
    })

    api.interceptors.response.use<Response['data']>(
      async (response: AxiosResponse<Response>) => {
        if (response.data.code !== 0) {
          throw Error(JSON.stringify(response.data))
        }
        return response.data.data
      }
    )

    global.api = api
  }

  private async login() {
    this.token = await user.login(this.info)
    await user.getInfo()
  }

  static single(info: ServerInfo) {
    return new NocalhostServe(info)
  }

  public async call(str: string) {
    const [moduleName, action] = str.split('.')

    const modules: any = { "devSpace": devSpace }

    const module = modules[moduleName]

    assert(module, `action cannot be empty`)
    assert(action in module, `'${str}' action not found`)

    await this.login()

    await module[action]()
  }
}
