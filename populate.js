require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./products.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log('Sucess!!!');
    process.exit(0); //termina el proceso,0=exito,1=fracaso
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
