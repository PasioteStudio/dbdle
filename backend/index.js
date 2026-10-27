import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import rateLimit from "express-rate-limit";
import schedule from "node-schedule";
import { fileURLToPath } from "node:url";
import { writeAutomatedNews } from "./util/newsStatus.js";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(backendDirectory, ".env") });

const [
  { doDaily },
  { default: perkRouter },
  { default: quoteRouter },
  { default: killerRouter },
  { default: loreRouter },
  { default: splashRouter },
  { default: terrorRadiusRouter },
] = await Promise.all([
  import("./util/daily.js"),
  import("./route/perk.js"),
  import("./route/quote.js"),
  import("./route/killer.js"),
  import("./route/lore.js"),
  import("./route/splash.js"),
  import("./route/terror_radius.js"),
]);

const app = express();
//express trust proxy if behind one (eg. when using vercel)
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
  message: "Too many requests from this IP, please try again after 5 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use((err, req, res, next) => {
  if (err) {
    return res.sendStatus(500);
  }
  next();
});
app.use(cors({
  origin: ["http://localhost:3002"],
  credentials: true,
  exposedHeaders: ['Set-Cookie']
}));
app.use(function (req, res, next) {
  res.set('Cache-Control', 'public, max-age=600, immutable');
  next();
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/perk",perkRouter)
app.use("/quote",quoteRouter)
app.use("/killer",killerRouter)
app.use("/splash",splashRouter)
app.use("/lore",loreRouter)
app.use("/terror_radius",terrorRadiusRouter)

async function refreshDailyWithStatus() {
  try {
    await doDaily();
  } catch (error) {
    await writeAutomatedNews("Daily challenge unavailable", error);
  }
}

const job = schedule.scheduleJob({hour:0,minute:0,tz:"Etc/GMT-2"}, () => {
  void refreshDailyWithStatus();
});

app.use("/splash_image_src", express.static(path.join(backendDirectory, "splash/splash.webp")));
app.use("/perk_image", express.static(path.join(backendDirectory, "perk/image.webp")));

app.get("/", async (req, res) => {
  let news;
  try {
    news = await readFile(path.join(backendDirectory, "news.txt"), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.sendStatus(200);
    }
    console.error("Failed to read news.txt");
    return res.sendStatus(500);
  }

  if (news.trim().length > 0) {
    return res.status(500).type("text/plain").send(news);
  }

  return res.sendStatus(200);
});

app.get(/(.*)/, async (req, res) => {
  return res.sendStatus(404);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
  void refreshDailyWithStatus();
});

server.on("error", (error) => {
  console.error("Failed to start the HTTP server");
  job.cancel();
});
