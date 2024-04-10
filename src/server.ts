import mongoose from "mongoose";
import app from "./app";

import { OrderDocument, OrderSchema } from "./models/Order";
import { GenreDocument, GenreSchema } from "./models/Genre";
import { ConditionDocument, ConditionSchema } from "./models/Condition";

const mongodbUrl = process.env.MONGODB_URL as string;
const port = process.env.PORT as string;

mongoose
  .connect(mongodbUrl, {
    dbName: "goldenrack",
  })
  .then(() => {
    app.listen(port, () => {
      console.log("Database goldenrack is connected");
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.log("MongDB connection error" + error);
    process.exit(1);
  });

mongoose.model<OrderDocument>("Order", OrderSchema);
mongoose.model<GenreDocument>("Genre", GenreSchema);
mongoose.model<ConditionDocument>("Condition", ConditionSchema);
