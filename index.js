const fs = require("fs");
const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify");
const crypto = require("crypto");
const csvFileName = "filename.output.csv";

// const writableStream = fs.createWriteStream(csvFileName);
const columns = [
  "TEAM NAMES",
  "Series Number",
  "Filename",
  "Name",
  "Description",
  "Gender",
  "Attributes",
  "UUID",
  "HASH",
];

let finalArray = [];

const stringifier = stringify({ header: true, columns: columns });
const writableStream = fs.createWriteStream(csvFileName);

let parser = parse({ columns: true }, function (err, records) {
  // mkdirSync;

  fs.mkdir("result", (err) => {
    if (err) {
      console.log("result folder already exists");
    } else {
      console.log("result folder has been created");
    }
  });

  records.forEach((element) => {
    // if (element["TEAM NAMES"].length === 0) {
    //   let teamName = element["TEAM NAMES"];
    // } else {
    //   teamName = "Rango";
    // }
    // json should conform to chip-0007 format
    // Calculate the hash of the json
    // Save the hash of the json in a new csv with the original CSV headings as well
    let newJson = {};
    newJson.format = "CHIP-0007";
    newJson.name = element.Name;
    newJson.description = element.Description;
    newJson.minting_tool = element["TEAM NAMES"];
    newJson.filename = element.Filename;
    newJson.gender = element.Gender;
    newJson.sensitive_content = false;
    newJson.series_number = parseInt(element["Series Number"]);
    newJson.series_total = records.length;

    newAttributes = [];
    let a = element.Attributes.split(";");
    a.forEach((el) => {
      b = el.split(":");
      c = {};
      c.trait_type = b[0].trim();
      c.value = b[1];
      newAttributes.push(c);
    });
    newJson.attributes = newAttributes;
    newJson.UUID = element.UUID;

    // console.log(newJson.attributes);
    // console.log(newJson);

    // Hash the JSON
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(newJson))
      .digest("hex");

    // Append hash to JSON file
    newJson.hash = hash;
    // console.log(newJson.hash);
    // console.log(newJson);

    // return;
    // console.log(element);
    fs.writeFile(
      `./result/nft${element.Filename}.json`,
      JSON.stringify(newJson, null, 4),
      (err) => {
        if (err) throw err; //if there is an error while creating file
        // console.log("File created successfully");
      }
    );

    // CSV JSON
    let csvJson = {};
    csvJson["TEAM NAMES"] = newJson.minting_tool;
    csvJson["Series Number"] = newJson.series_number;
    csvJson["Filename"] = newJson.filename;
    csvJson["Name"] = newJson.name;
    csvJson["Description"] = newJson.description;
    csvJson["Gender"] = newJson.gender;
    csvJson["Attributes"] = element.Attributes;
    csvJson["UUID"] = newJson.UUID;
    csvJson["HASH"] = newJson.hash;

    stringifier.write(Object.values(csvJson));
  });

  stringifier.pipe(writableStream);
  // console.log(records);
});

fs.createReadStream(__dirname + "/a-csv.csv").pipe(parser);
