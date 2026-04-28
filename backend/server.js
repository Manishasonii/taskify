const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err));

const taskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// Add
app.post('/add', async (req, res) => {
  const task = new Task({ text: req.body.text });
  await task.save();
  res.send(task);
});

// Get
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

// Update
app.put('/update/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(updated);
});

// Delete
app.delete('/delete/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on 5000"));