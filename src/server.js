const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Redis = require('ioredis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Para manejar tokens JWT

// Configuración de Redis
const redis = new Redis();

redis.on('error', err => console.log('Redis Client Error', err));

const app = express();

app.use(cors({
  origin: 'http://localhost:3001' // Permite solicitudes desde el frontend
}));

app.use(bodyParser.json());

// Endpoint para el registro de usuario
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Verifica si el usuario ya existe
    const existingUser = await redis.hgetall(username);
    if (existingUser && existingUser.username) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash del password y guarda el nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    await redis.hmset(username, {
      username,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Endpoint para el login de usuario
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Recupera el usuario de Redis
    const user = await redis.hgetall(username);
    if (!user || !user.username) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compara la contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Genera un token JWT
    const token = jwt.sign({ username }, '3556', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Endpoint para obtener datos
app.get('/data', async (req, res) => {
  try {
    const data = await redis.hgetall('cardData');
    res.json(data || {});
  } catch (err) {
    res.status(500).send(err);
  }
});


// Endpoint para actualizar datos
app.put('/data', async (req, res) => {
  const data = req.body;

  console.log("Datos recibidos para actualizar:", data);

  try {
    // Actualizar los campos en Redis sin usar un campo ID
    await redis.hmset('cardData', data);
    console.log('Datos actualizados en Redis');
    res.send('Data updated successfully');
  } catch (err) {
    console.error('Error actualizando datos en Redis:', err);
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
