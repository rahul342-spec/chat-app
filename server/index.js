import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactRoutes from "./routes/ContactRoutes.js"
import setupSocket from "./socket.js"
import messageRoutes from "./routes/MessageRoutes.js"

dotenv.config();


const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;

const allowedOrigins = [
  process.env.ORIGIN,
 process.env.ORIGIN_TWO, 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// app.use(cors({
//     origin: [process.env.ORIGIN],
//     methods:["GET","POST","PUT","PATCH","DELETE"],
//     credentials : true
// }));

app.use("/uploads/profiles",express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/contacts',contactRoutes);
app.use('/message',messageRoutes);

const server = app.listen(port, () => {
    console.log('App listening on port 3000!',port);
});

setupSocket(server)

mongoose.connect(databaseUrl).then(()=>console.log("connect")).catch((error)=>console.log("error",error.message))