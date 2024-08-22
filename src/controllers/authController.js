const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Para manejar tokens JWT
const redis = require('../redisclient'); // Asegúrate de que la ruta sea correcta

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await redis.hgetall(`user:${username}`);
    if (existingUser.username) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash del password y guarda el nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    await redis.hmset(`user:${username}`, {
      username,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica que el usuario y la contraseña se proporcionen
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Recupera el usuario de Redis
    const user = await redis.hgetall(`user:${username}`);
    if (!user || !user.username) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compara la contraseña proporcionada con la hasheada almacenada en Redis
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Genera un token JWT
    const token = jwt.sign({ username }, '3556', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
