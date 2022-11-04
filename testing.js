const fs = require("fs");
const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify");
const crypto = require("crypto");
const csvFileName = "filename.output.csv";
const writableStream = fs.createWriteStream(csvFileName);
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

let parser = parse({ columns: true }, function (err, records) {
  // mkdirSync;
  fs.mkdir("result", (err) => {
    if (err) {
      console.log("result folder already exists");
    } else {
      console.log("result folder has been created");
    }
  });
  //   records.forEach((element) => {
  //     let newJson = {};
  //     newJson.format = "CHIP-0007";
  //     newJson.name = element.Name;
  //     newJson.description = element.Description;
  //     newJson.minting_tool = element["TEAM NAMES"];
  //     newJson.filename = element.Filename;
  //     newJson.gender = element.Gender;
  //     newJson.sensitive_content = false;
  //     newJson.series_number = parseInt(element["Series Number"]);
  //     newJson.series_total = records.length;

  //     newAttributes = [];
  //     let a = element.Attributes.split(";");
  //     a.forEach((el) => {
  //       b = el.split(":");
  //       c = {};
  //       c.trait_type = b[0].trim();
  //       c.value = b[1];
  //       newAttributes.push(c);
  //     });
  //     newJson.attributes = newAttributes;
  //     newJson.UUID = element.UUID;

  //     const hash = crypto
  //       .createHash("sha256")
  //       .update(JSON.stringify(newJson))
  //       .digest("hex");

  //     // Append hash to JSON file
  //     newJson.hash = hash;
  //     // console.log(newJson.hash);
  //     console.log(newJson);

  //     // return;
  //     // console.log(element);
  //     fs.writeFile(
  //       `./result/nft${element.Filename}.json`,
  //       JSON.stringify(newJson, null, 4),
  //       (err) => {
  //         if (err) throw err; //if there is an error while creating file
  //         // console.log("File created successfully");
  //       }
  //     );
  //   });
  //   console.log(records);
});

fs.createReadStream(__dirname + "/a-csv.csv")
  .pipe(parse({ columns: true }))
  .on("data", function (records) {
    records.forEach((element) => {
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

      console.log(newJson);
      return;

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

      const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(newJson))
        .digest("hex");

      // Append hash to JSON file
      newJson.hash = hash;
      // console.log(newJson.hash);
      console.log(newJson);
    });
    console.log(records);
  });

// fs.createWriteStream(__dirname + "/filename.output..csv").pipe(stringifier);
// .pipe(process.stdout);
