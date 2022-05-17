const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  //throw new Error('testing async errors');
  const products = await Product.find({
    name: 'vase table',
  });
  res.status(200).json({ products, nbHits: products.length }); //msg: 'products testing route'
};

const getAllProducts = async (req, res) => {
  const { featured, company, name } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false; // si featured no esta vacia,le asigno a el objeto creado objectQuery un campo llamado featured y le asigno true o false.Esto es para evitar bug que muestra vacio si paso una propiedad como query que no existe
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = name;
  }
  console.log(req.query);
  const products = await Product.find(queryObject); //await Product.find(req.query);//ojo con poner {name:req.query},primero que ya viene como objeto y segundo ya viene el campo a filtrar
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
