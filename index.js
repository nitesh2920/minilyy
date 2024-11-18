const express=require("express");
const mongoose=require('mongoose');
const cors=require('cors')
const dotenv=require('dotenv')
const app=express()

dotenv.config()
const urlRouter=require('./routes/url')

mongoose.connect(process.env.SERVER_LINK).then(
  () => {console.log("db connected")}
).catch(err => {console.log(err)})

app.use(cors())
app.use(express.json())


app.get('/:shortId', (req, res, next) => {
  req.url = `/api/v1/url/r/${req.params.shortId}`;
  next();
});

app.use("/api/v1/url",urlRouter)

// app.get()


app.listen(3000,()=>{
    console.log("Server is connected");
})

