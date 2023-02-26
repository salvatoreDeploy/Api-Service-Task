import { parse } from "csv";
import fs from "node:fs";

const csvPath = new URL("./tasks.csv", import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ",",
  skip_empty_lines: true,
  from_line: 2,
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const lineParse = stream.pipe(csvParse);

  for await (const line of lineParse) {
    const [title, description] = line;

    await fetch("http://localhost:3333/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    await wait(1000);
  }
}

run();
