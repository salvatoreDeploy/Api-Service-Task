import fs from "node:fs/promises";
const databasePath = new URL("db.json", import.meta.url);

export class Database {
  #databse = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#databse = JSON.parse(data);
      })
      .catch(() => {
        this.#save();
      });
  }

  #save() {
    fs.writeFile(databasePath, JSON.stringify(this.#databse));
  }

  select(table, search) {
    let data = this.#databse[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          if (!value) return true;
          return row[key].includes(value);
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#databse[table])) {
      this.#databse[table].push(data);
    } else {
      this.#databse[table] = [data];
    }

    this.#save();

    return data;
  }

  delete(table, id) {
    const rowIndex = this.#databse[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#databse[table].splice(rowIndex, 1);
      this.#save();
    }
  }

  update(table, id, data) {
    const rowIndex = this.#databse[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      const row = this.#databse[table][rowIndex];
      this.#databse[table][rowIndex] = { id, ...row, ...data };
      this.#save();
    }
  }
}
