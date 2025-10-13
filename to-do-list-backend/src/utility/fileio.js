import fs from 'node:fs/promises'

const dataPath = './database/data.json'

const readTasks = async () => {
  const data = await fs.readFile(dataPath, 'utf-8')
  return JSON.parse(data || '[]')
}

const writeTasks = async (data) => {
  const jsonData = JSON.stringify(data, null, 2)
  await fs.writeFile(dataPath, jsonData)
}

export default { readTasks, writeTasks }
