import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const fs = require('fs');

const postsDirectory = path.join(process.cwd(), 'posts')
console.log(postsDirectory)

export const getSortedPostsData = () => {
  const fileNames = fs.readdirSync(postsDirectory)
  console.log('fileNames:', fileNames )
  
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    console.log('fullPath:', fullPath)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    console.log('fileContents:', fileContents)
    const matterResult = matter(fileContents)
    console.log('matterResult', matterResult)
    return {
      id,
      ...matterResult.data,
    }
  })
  return allPostsData.sort((a,b) => {
    if (a.date < b.date) {
      return 1
    }
    else {
      return -1
    }
  })

}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map(fileName => {
    
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}
export async function getPostData(id) {
  
  const pathToFile = path.join(postsDirectory, `${id}.md` )
  const fileContents = fs.readFileSync(pathToFile, 'utf-8')
  // console.log('fileContents at getPostData:', fileContents)
  
  const matterResult = matter(fileContents)
 
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
 
    const contentHtml = processedContent.toString()
    console.log('contentHtml:', contentHtml)
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}