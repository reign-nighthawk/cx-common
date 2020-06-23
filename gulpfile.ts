import { series } from 'gulp'
import path from 'path'
import fse from 'fs-extra'
import chalk from 'chalk'
import { rollup } from 'rollup'
import conventionalChangelog from 'conventional-changelog'
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

const complete: TaskFunc = (cb) => {
  log.progress('---- end ----')
  cb()
}

export const build = series(clearLibFile, buildByRollup, complete)

// 自定义生成 changelog
export const changelog: TaskFunc = async (cb) => {
  const changelogPath: string = path.join(paths.root, 'CHANGELOG.md')
  // 对命令 conventional-changelog -p angular -i CHANGELOG.md -w -r 0
  const changelogPipe = await conventionalChangelog({
    preset: 'angular',
    releaseCount: 0,
  })
  changelogPipe.setEncoding('utf8')

  const resultArray = ['# 工具库更新日志\n\n']
  changelogPipe.on('data', (chunk) => {
    // 原来的 commits 路径是进入提交列表
    chunk = chunk.replace(/\/commits\//g, '/commit/')
    resultArray.push(chunk)
  })
  changelogPipe.on('end', async () => {
    await fse.createWriteStream(changelogPath).write(resultArray.join(''))
    cb()
  })
}