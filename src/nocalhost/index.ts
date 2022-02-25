import axios, {AxiosResponse} from 'axios'
import assert from 'assert'
import {saveState} from '@actions/core'

import devSpace from './dev-space'
import {ActionResult, ServerInfo} from './type'
import user from './user'

interface Response {
  code: number
  message: string
  data: unknown
}

export class NocalhostServe {
  private token?: string

  private constructor(private info: ServerInfo) {
    const api = axios.create({baseURL: info.host})

    api.interceptors.request.use(async config => {
      config.headers = config.headers ?? {}

      if (this.token) {
        config.headers['authorization'] = `Bearer ${this.token}`
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
    if (this.info.token && this.info.uid) {
      this.token = this.info.token
      global.uid = this.info.uid
    } else {
      this.token = await user.login(this.info)
      this.info.token = this.token

      await user.getInfo()
      this.info.uid = global.uid
    }

    saveState('serverInfo', this.info)
  }

  static single(info: ServerInfo) {
    return new NocalhostServe(info)
  }

  async call(str: string): Promise<ActionResult> {
    const [moduleName, action] = str.split('.')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modules: any = {devSpace}

    const module = modules[moduleName]

    assert(module, `action cannot be empty`)
    assert(action in module, `'${str}' action not found`)

    await this.login()

    return module[action]()
  }
}
