const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort('-name prince');
  res.status(200).json({ products, nbHits: products.length }); //msg: 'products testing route'
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query; //el usuario tiene tres maneras de filtrado
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false; // si featured no esta vacia,le asigno a el objeto creado objectQuery un campo llamado featured y le asigno true o false.Esto es para evitar bug que muestra vacio si paso una propiedad como query que no existe
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }; //me permite buscar un string especifico dentro de una cadena,muy util si no se el valor exacto del campo
  }
  //console.log(req.query);
  let result = Product.find(queryObject); //Product.find(queryObject); //await Product.find(req.query);//ojo con poner {name:req.query},primero que ya viene como objeto y segundo ya viene el campo a filtrar
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createAt');
  }
  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
