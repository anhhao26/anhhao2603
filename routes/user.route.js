import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const DB_PATH = path.join(process.cwd(), 'database.json');

// Utility function to read the database file
function readDatabase() {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Utility function to write data to the database file
function writeDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// GET all users: GET /users
router.get('/', (req, res) => {
  const database = readDatabase();
  res.status(200).json(database.users);
});

// GET a specific user by ID: GET /users/:id
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const database = readDatabase();
  const user = database.users.find(u => u.id === userId);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// POST a new user: POST /users
router.post('/', (req, res) => {
  const { fullName, address } = req.body;
  if (!fullName || !address) {
    return res.status(400).json({ message: "fullName and address are required" });
  }
  const database = readDatabase();
  const newUserId = database.users.length > 0 
    ? database.users[database.users.length - 1].id + 1 
    : 1;
  const newUser = { id: newUserId, fullName, address };
  database.users.push(newUser);
  writeDatabase(database);
  res.status(201).json(newUser);
});

// PUT update a user entirely: PUT /users/:id
router.put('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { fullName, address } = req.body;
  if (!fullName || !address) {
    return res.status(400).json({ message: "fullName and address are required" });
  }
  const database = readDatabase();
  const userIndex = database.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  database.users[userIndex] = { id: userId, fullName, address };
  writeDatabase(database);
  res.status(204).send();
});

// DELETE a user: DELETE /users/:id
router.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const database = readDatabase();
  const userIndex = database.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  const removedUser = database.users.splice(userIndex, 1)[0];
  writeDatabase(database);
  res.status(200).json(removedUser);
});

export default router;
