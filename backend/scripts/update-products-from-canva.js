// Script to update products from Canva site
// Run with: node backend/scripts/update-products-from-canva.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI not found in .env file');
  process.exit(1);
}

const productsFromCanva = [
  {
    name: 'Gummy de CBD e THC',
    slug: 'gummy-cbd-thc',
    subtitle: 'Sono Profundo, noites reparadoras',
    description: 'Desenvolvida para promover noites de sono mais profundas e reparadoras. Sua fórmula equilibrada combina relaxamento natural, redução do estresse e suporte ao bem-estar, ajudando você a acordar renovado e com mais energia para o dia.',
    price: 330.00,
    images: ['https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=900&q=80'],
    category: 'gummy',
    restrictions: 'Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.',
    visible: true
  },
  {
    name: 'Creme CBD + CBG + CBN + CBC',
    slug: 'creme-cbd-cbg-cbn-cbc',
    subtitle: 'Alívio instântaneo e recuperação rápida',
    description: 'Formulado para potencializar a recuperação muscular, aliviar dores e agir como anti-inflamatório natural. Composto por fitocanabinoides e terpenos que atuam em sinergia, promove equilíbrio, bem-estar e suporte diário para quem busca performance e qualidade de vida.',
    price: 330.00,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf100?auto=format&fit=crop&w=900&q=80'],
    category: 'creme',
    restrictions: 'Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.',
    visible: true
  },
  {
    name: 'Óleo de CBD e CBG',
    slug: 'oleo-cbd-cbg',
    subtitle: 'Foco aumentado e performance contínua.',
    description: 'Ideal para quem busca foco, concentração e resistência ao longo do dia. Com fórmula pura e precisa, auxilia no equilíbrio mental e físico, reduz distrações e promove clareza, energia sustentável e desempenho superior em cada desafio.',
    price: 330.00,
    images: ['https://images.unsplash.com/photo-1617653513183-0e3d963902df?auto=format&fit=crop&w=900&q=80'],
    category: 'oleo',
    restrictions: 'Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.',
    visible: true
  }
];

async function updateProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📦 Updating products from Canva site...\n');

    for (const productData of productsFromCanva) {
      const existingProduct = await Product.findOne({ slug: productData.slug });
      
      if (existingProduct) {
        // Update existing product
        Object.assign(existingProduct, productData);
        await existingProduct.save();
        console.log(`✅ Updated: ${productData.name}`);
      } else {
        // Create new product
        const newProduct = new Product(productData);
        await newProduct.save();
        console.log(`✅ Created: ${productData.name}`);
      }
    }

    // Remove old products that are not in the new list
    const currentSlugs = productsFromCanva.map(p => p.slug);
    const result = await Product.deleteMany({ 
      slug: { $nin: currentSlugs },
      category: { $in: ['gummy', 'oleo', 'creme'] }
    });
    
    if (result.deletedCount > 0) {
      console.log(`\n🗑️  Removed ${result.deletedCount} old product(s)`);
    }

    console.log('\n✅ Products updated successfully!');
    console.log(`\n📊 Total products: ${await Product.countDocuments()}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating products:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updateProducts();

