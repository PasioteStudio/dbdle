import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const newsFilePath = path.resolve(currentDirectory, "../news.txt");
const AUTOMATED_NEWS_PREFIX = "Automated service error: ";

export async function writeAutomatedNews(context, error) {
  const message = error instanceof Error ? error.message : String(error);
  const news = `${AUTOMATED_NEWS_PREFIX}${context}: ${message}`;
  console.error(news);

  try {
    await writeFile(newsFilePath, news, "utf8");
  } catch (writeError) {
    console.error("Failed to update news.txt with the service error");
  }
}

export async function clearAutomatedNews() {
  try {
    const news = await readFile(newsFilePath, "utf8");
    if (news.startsWith(AUTOMATED_NEWS_PREFIX)) {
      await writeFile(newsFilePath, "", "utf8");
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Failed to clear the service error from news.txt");
    }
  }
}
