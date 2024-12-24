const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); // need to use (..) to give edge from current folder
const initData = require("./data.js");
const atlasDbUrl = process.env.ATLASDB_URL;
async function main() {
  try {
    await mongoose.connect(atlasDbUrl);
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
    owner: "6758519911ff539aeca97f32",
  }));
  await Listing.insertMany(initData.data);
  console.log("data initialized successfully");
};

initDB();
