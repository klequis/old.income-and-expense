import fs from 'fs'
import path from 'path'

// export const readRuleFile = async fullPath => {
//   // green('dirName', path.join(__dirname, 'rules.json'))
//   try {
//     // const rulesFullPath = path.join(__dirname, 'rules.json')
//     const rulesFullPath = path.join(__dirname, 'rules-wf-chk.json')
//     const rules = await fs.promises.readFile(rulesFullPath)
//     const json = await JSON.parse(rules)
//     return json
//   } catch (e) {
//     redf('readRules ERROR: ', e.message)
//   }
// }

const getFiles = async (relativePath, extension) => {
  const dirToRead = path.join(__dirname, relativePath)
  const allFiles = await fs.promises.readdir(dirToRead)
  const allFullPathFiles = allFiles.map(file => path.join(dirToRead, file))
  // console.log('allFullPathFiles', allFullPathFiles)
  return allFullPathFiles.filter(file => path.extname(file) === extension)
}

const createFileObjects = async (relativePath, extension) => {
  const files = await getFiles(relativePath, extension)
  return files.map(file => {
    return {
      fullPath: file,
      basename: path.basename(file, extension)
    }
  })
}

const getRulesAndData = async () => {
  const rfs = await createFileObjects('../rules', '.json')
  // console.log('rfs', rfs)

  const dfs = await createFileObjects('../data', '.csv')
  // console.log('dfs', dfs)

  const a = rfs.map(rf => ({
    ruleFile: rf,
    dataFile: dfs.find(df => rf.basename === df.basename)
  }))

  console.log(a)
  return a
}

export default getRulesAndData
