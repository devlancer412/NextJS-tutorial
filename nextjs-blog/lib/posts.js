import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postDirectory = path.join(process.cwd(), "posts");

export function getStoredPostData() {
  const fileNames = fs.readdirSync(postDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(postDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    };
  });

  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullName = postDirectory + "/" + id + ".md";
  const fileContents = fs.readFileSync(fullName, "utf8");

  const matterResult = matter(fileContents);

  const processContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
// export async function getStoredPostsData() {
//   try {
//     console.log(res);
//     const res = await fetch("..");
//     return res.json();
//   } catch (err) {
//     console.log(err);
//   }
// }
