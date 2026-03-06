const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "http://10.246.173:8080";

app.get('/users', async (req, res) => {
  const response = await axios.get(`${API_URL}/users`);
  res.json(response.data);
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  await pool.query(
    "UPDATE users SET name=$1, email=$2 WHERE id=$3",
    [name, email, id]
  );

  res.json({ message: "User updated" });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

app.get('/', (req, res) => {
  res.send('API CRUD Microservice is running 🚀');
});
