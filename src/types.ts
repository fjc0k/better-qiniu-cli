import * as modules from './modules'
import { auth } from 'qiniu'
import { ValueOf } from 'vtils'

type Modules = typeof modules
type ModuleName = keyof Modules

export interface ModulePayload<Options> {
  mac: auth.digest.Mac,
  options: Options,
}

export interface ModuleFunction<Options, Result = any> {
  (options: ModulePayload<Options>): Promise<Result>,
}

export interface QiniuHttpResponseInfo {
  statusCode: number,
}

export interface Config {
  accessKey: string,
  secretKey: string,
  tasks: Array<ValueOf<{
    [K in ModuleName]: {
      type: K,
      options: Parameters<Modules[K]>[0],
    }
  }>>,
}
