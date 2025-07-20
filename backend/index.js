const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const loginRoute = require('./auth');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', loginRoute);

const PORT = process.env.PORT || 8180;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
