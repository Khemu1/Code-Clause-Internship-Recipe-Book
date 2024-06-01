import express from "express";
import sqlite3 from "sqlite3";
import multer from "multer";
import path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { storeRecipe, editRecipe } from "./src/validation/index.js";
import { transformYupErrorsIntoObject } from "./src/utils.js";

const db = new sqlite3.Database("recipes.db");

db.run(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    recipe TEXT,
    thumbnail TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationFolder = "";
    if (file.fieldname === "thumbnail") {
      destinationFolder = "thumbnail";
    }
    cb(null, path.join(__dirname, `public/assets/images/${destinationFolder}`));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post(
  "/submit",
  upload.fields([{ name: "bigImage" }, { name: "thumbnail" }]),
  async (req, res) => {
    let recipe = {};
    try {
      recipe = await storeRecipe.validate(
        {
          title: req.body.title,
          recipe: req.body.recipe,
          thumbnail: req.files.thumbnail
            ? `${req.files.thumbnail[0].filename}`
            : null,
        },
        // need to make it possbile to convert the errors into an objcet otherwise the method will return an empty object
        { abortEarly: false }
      );
    } catch (err) {
      console.error(err);
      return res.status(401).json(transformYupErrorsIntoObject(err));
    }
    try {
      const stmt = db.prepare(`
        INSERT INTO recipes (title, recipe, thumbnail)
        VALUES (?, ?, ?)
      `);
      stmt.run(recipe.title, recipe.recipe, recipe.thumbnail, (err) => {
        if (err) {
          console.error("DB insertion error:", err);
          return res.status(500).send("error with DB insertion");
        }
        return res.status(200).send("success");
      });
    } catch (error) {
      console.error("Error during DB insertion:", error);
      return res.status(500).send("error with DB insertion");
    }
  }
);

app.get("/data", (req, res) => {
  db.all("SELECT * FROM recipes", [], (err, rows) => {
    if (err) {
      console.error("Error retrieving data:", err);
      return res.status(500).send("Error retrieving data");
    }
    res.json(rows);
  });
});

app.post("/delete", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send("id is required");
  }

  db.get("SELECT thumbnail FROM recipes WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("DB retrieval error:", err);
      return res.status(500).send("error retrieving the record");
    }

    if (!row) {
      return res.status(404).send("record not found");
    }

    const thumbnail = row.thumbnail;

    let stmt = db.prepare("DELETE FROM recipes WHERE id = ?");
    stmt.run(id, (err) => {
      if (err) {
        console.error("DB deletion error:", err);
        return res.status(500).send("error with DB deletion");
      }

      const filePath = path.join(
        __dirname,
        "assets/images/thumbnail",
        thumbnail
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("File deletion error:", err);
          return res.status(500).send("error with file deletion");
        }

        res.status(200).send("deleted");
      });
    });
  });
});

app.put("/update", upload.fields([{ name: "thumbnail" }]), async (req, res) => {
  const { id, title, recipe } = req.body;
  let info = req.body;
  try {
    info = await editRecipe.validate(
      {
        id: req.body.id,
        title: req.body.title,
        recipe: req.body.recipe,
      },
      // need to make it possbile to convert the errors into an objcet otherwise the method will return an empty object
      { abortEarly: false }
    );
  } catch (err) {
    console.error(err);
    return res.status(401).json(transformYupErrorsIntoObject(err));
  }
  db.get(`Select thumbnail from recipes where id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).send("error while retriving existing record");
    }
    let thumbnail = row.thumbnail;
    if (req.files.thumbnail) {
      const oldThumbnailPath = path.join(__dirname, "public", thumbnail);
      thumbnail = `${req.files.thumbnail[0].filename}`;
      fs.unlink(oldThumbnailPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting old thumbnail:", err);
        }
      });
    }
    const sql = `
    UPDATE recipes 
    SET title = ?, recipe = ?, thumbnail = ?
    WHERE id = ?
  `;
    db.run(sql, [title, recipe, thumbnail, id], (err) => {
      if (err) {
        console.error("Error during DB update:", err);
        return res.status(500).send("Error with DB update");
      }
      res.status(200).send("Updated successfully");
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
