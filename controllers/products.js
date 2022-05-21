const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({})
    .sort('name')
    .select('name price')
    .limit(5)
    .skip(1);
  res.status(200).json({ products, nbHits: products.length }); //msg: 'products testing route'
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query; //el usuario tiene tres maneras de filtrado //no necesariamente hay que poner el nombre exacto de la funcion,ej fields
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
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq',
    };
    const regEx = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      //si ingreso por ej price>40,rating>=4 filters tendra  price-$gt-40 y rating-$gte-4
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }; // si pongo sin [] me da el noombre literal y no el valor.En value Number quizas funciona como un .log que accede al valor
      }
    });
  }

  console.log(queryObject);
  let result = Product.find(queryObject); //Product.find(queryObject); //await Product.find(req.query);//ojo con poner {name:req.query},primero que ya viene como objeto y segundo ya viene el campo a filtrar
  //sort
  if (sort) {
    const sortList = sort.split(',').join(' '); // separa los valores que vienen con coma en sort y los vuelve a junar separandolos por espacio
    result = result.sort(sortList);
  } else {
    result = result.sort('createAt'); // si el usuario no ingresa algo en sort,por default lo va a ordenar por createAt
  }
  //select
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1; // 1 y 10 serian por default si no se ingresa esto como query
  const limit = Number(req.query.limit) || 10; // se usa Number porque el valor que viene como parametro es un string
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result; //el await se usa al final ya que si intento encadenarlo despues del await Product.find(queryObject) dara error,ya que me ya no tendria el product.find solo los resultados devueltos
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
