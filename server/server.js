const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const colors = require('colors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');

//BackEnd Protection
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const dotenv = require('dotenv');

const app = express();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

dotenv.config({ path: './config/config.env' });

// Sanitize data
app.use(mongoSanitize());

// Set security header
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});

// Prevent HTTP Param Pollution
app.use(hpp());
// Connect to DB
connectDB();
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(cors());

if (process.env.NODE_ENV == 'development') {
  app.use(cors({ origin: process.env.CLIENT_URL }));
}

app.use('/api', authRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(colors.magenta.italic(`Server started on port ${PORT}`))
);
