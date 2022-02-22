import {setFailed} from '@actions/core'

export default async function run(fun: () => Promise<void>): Promise<void> {
  try {
    await fun()

    process.exit(0)
  } catch (error) {
    if (process.env.CI) {
      if (error instanceof Error) {
        setFailed(error.message)
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(error)
      process.exit(1)
    }
  }
}
