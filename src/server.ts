import mongoose from "mongoose";
import app from "./app";
import https from "https";
import fs from "fs";

import { OrderDocument, OrderSchema } from "./models/Order";
import { GenreDocument, GenreSchema } from "./models/Genre";
import { ConditionDocument, ConditionSchema } from "./models/Condition";
import { StockDocument, StockSchema } from "./models/Stock";
import { StockItemDocument, StockItemSchema } from "./models/StockItem";

const mongodbUrl = process.env.MONGODB_URL as string;
const port = process.env.PORT as string;

mongoose
  .connect(mongodbUrl, {
    dbName: "goldenrack",
  })
  .then(() => {
    const httpsOptions = {
      key: fs.readFileSync("./dist/src/certs/private.key"),
      cert: fs.readFileSync("./src/certs/certificate.crt"),
      ca: fs.readFileSync("./src/certs/ca_bundle.crt"),
    };
    const httpServer = https.createServer(httpsOptions, app);

    httpServer.listen(port, () => {
      console.log("Database goldenrack is connected");
      console.log(`HTTPS Server is running on https://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.log("MongDB connection error" + error);
    process.exit(1);
  });

mongoose.model<OrderDocument>("Order", OrderSchema);
mongoose.model<GenreDocument>("Genre", GenreSchema);
mongoose.model<ConditionDocument>("Condition", ConditionSchema);
mongoose.model<StockDocument>("Stock", StockSchema);
mongoose.model<StockItemDocument>("StockItem", StockItemSchema);
