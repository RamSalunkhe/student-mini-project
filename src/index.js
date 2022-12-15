const express = require ('express');
const mongoose = require ('mongoose');
const route = require ('./routes/route');
const app = express();

app.use(express.json());

let url = "mongodb+srv://ramsalunkhe:sUOyIj9HGKV3LteV@cluster0.3p05c8c.mongodb.net/student-mini-project";
let port = process.env.PORT || 3000;

mongoose.set('strictQuery', true);
mongoose.connect(url, {useNewUrlParser: true})
.then(() => console.log("MongoDB is Connected..."))
.catch(err => console.log(err));

app.use("/", route);
app.listen(port, () => {
    console.log("Express app is running on port " +port)
})