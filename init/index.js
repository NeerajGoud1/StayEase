const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); // need to use (..) to give edge from current folder
const initData = require("./data.js");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/stayease");
    console.log("connected to db sucessfully");
  } catch (err) {
    console.log(err);
  }
}
main();

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "674b4d61c2849aa4ee900aec",
  }));
  await Listing.insertMany(initData.data);
  console.log("data initialized successfully");
};

initDB();
