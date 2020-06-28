import { series } from 'gulp'
import path from 'path'
import fse from 'fs-extra'
import chalk from 'chalk'
import { rollup } from 'rollup'
import rollupConfig from './rollup.config'
interface TaskFunc {
  // eslint-disable-next-line @typescript-eslint/ban-types
  (cb: Function): void
}

const log = {
  progress: (text: string) => {
    console.log(chalk.green(text))
  },
  error: (text: string) => {
    console.log(chalk.red(text))
  },
}

const paths = {
  root: path.join(__dirname, '/'),
  lib: path.join(__dirname, '/lib'),
  src: path.join(__dirname, '/lib/src'),
}


// 删除 lib 文件
const clearLibFile: TaskFunc = async (cb) => {
  fse.removeSync(paths.lib)
  log.progress('Deleted lib file')
  cb()
}

// rollup 打包
const buildByRollup: TaskFunc = async (cb) => {
  const inputOptions = {
    input: rollupConfig.input,
    external: rollupConfig.external,
    plugins: rollupConfig.plugins,
  }
  const outOptions = rollupConfig.output
  const bundle = await rollup(inputOptions)

  // 写入需要遍历输出配置
  if (Array.isArray(outOptions)) {
    outOptions.forEach(async (outOption) => {
      await bundle.write(outOption)
    })
    cb()
    log.progress('Rollup built successfully')
  }
}
const rmSrc: TaskFunc = async (cb) => {
  await tcapSrc()
  cb()
}
const tcapSrc = () => {
  return new Promise((res)=>{
    setTimeout(() => {
      fse.copySync(paths.src,paths.lib)
      // fse.emptyDirSync(paths.src)
      fse.removeSync(paths.src)
      fse.chmodSync(paths.lib,'777')
      log.progress('Declaration File built successfully')
      res()
    }, 1000)
  })
}
const complete: TaskFunc = (cb) => {
  log.progress('---- end ----')
  cb()
}

export const build = series(clearLibFile, buildByRollup,rmSrc,complete)