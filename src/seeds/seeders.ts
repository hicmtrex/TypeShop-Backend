import connectDb from '../config/db';
import Product from '../models/productModel';
import colors from 'colors';
import products from './products';
import dotenv from 'dotenv';
dotenv.config();


connectDb();

const importData = async () => {
  try {
    await Product.deleteMany();

    await Product.insertMany(products);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importData();
