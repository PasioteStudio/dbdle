const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');
const schedule = require('node-schedule');
const [doDaily] = require("./util/daily")
const perkRouter = require("./route/perk")
const quoteRouter = require("./route/quote")
const killerRouter = require("./route/killer")
const splashRouter = require("./route/splash")
//const initDB = require("./db/initDB")



dotenv.config({ path: path.join(__dirname, './.env') });
const app = express();

/*app.use((err, req, res, next) => {
  if (err) {
    return res.sendStatus(500);
  } //TODO: add this in production
  next();
});*/
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/perk",perkRouter)
app.use("/quote",quoteRouter)
app.use("/killer",killerRouter)
app.use("/splash",splashRouter)

const job = schedule.scheduleJob('0 0 * * *', function(){
  doDaily()
});

//app.use("/image", express.static(__dirname + '/uploads')); //lehetne, de a számláknál például jogosultság kell

app.get(/(.*)/,function (req, res, next) {
  res.status(404).json({ error: "not found" });
})
app.listen(process.env.PORT, async () => {
  //init db
  await doDaily()
  //initDB()
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
})