// Node.js script to run database setup
// This script connects to MongoDB and runs the setup commands
// Usage: node run-database-setup.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI not found in .env file');
  console.log('Please set MONGO_URI in backend/.env file');
  process.exit(1);
}

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Insert sample products (skip if already exist)
    console.log('📦 Inserting sample products...');
    const productCount = await db.collection('products').countDocuments();
    if (productCount === 0) {
      const products = await db.collection('products').insertMany([
      {
        name: "Gummy",
        slug: "gummy",
        description: "Gomas de CBD para bem-estar e equilíbrio. Fórmula desenvolvida com ingredientes naturais e eficazes, elaborada por especialistas e analisada lote a lote para garantir excelência.",
        images: ["https://via.placeholder.com/400x400?text=Gummy"],
        restrictions: "Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.",
        visible: true,
        category: "gummy",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Óleo",
        slug: "oleo",
        description: "Óleo de CBD para uso terapêutico. Produto importado, testado e com qualidade reconhecida. Ideal para diversas aplicações conforme prescrição médica.",
        images: ["https://via.placeholder.com/400x400?text=Oleo"],
        restrictions: "Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.",
        visible: true,
        category: "oleo",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Creme",
        slug: "creme",
        description: "Creme tópico à base de CBD para aplicação local. Formulado com ingredientes naturais eficazes para uso conforme orientação médica.",
        images: ["https://via.placeholder.com/400x400?text=Creme"],
        restrictions: "Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.",
        visible: true,
        category: "creme",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
      console.log(`✅ Inserted ${products.insertedCount} products`);
    } else {
      console.log(`⚠️  Products already exist (${productCount} found). Skipping...`);
    }

    // Insert FAQs (skip if already exist)
    console.log('❓ Inserting FAQs...');
    const faqCount = await db.collection('faqs').countDocuments();
    if (faqCount === 0) {
      const faqs = await db.collection('faqs').insertMany([
      {
        question: "O que é Cannabis Medicinal ?",
        answer: "A cannabis medicinal refere-se ao uso de componentes da planta Cannabis para fins terapêuticos, sob prescrição e acompanhamento médico. Os produtos à base de CBD (canabidiol) e outros canabinoides são utilizados para promover bem-estar, alívio de sintomas e melhoria da qualidade de vida, sempre com orientação profissional adequada.",
        order: 1,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: "Quais os principais benefícios dos produtos?",
        answer: "Os produtos à base de CBD podem ajudar no bem-estar geral, performance física e mental, recuperação, equilíbrio mental e físico, além de auxiliar no sono e concentração. Os benefícios variam conforme a indicação médica e o perfil de cada paciente.",
        order: 2,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: "Preciso de receita médica para comprar os produtos da EverWell?",
        answer: "Sim. Todos os produtos são restritos conforme as Resoluções da Diretoria Colegiada (RDC) 327/2019 e 660/2022 da Anvisa e requerem prescrição médica e autorização da Anvisa. É por isso que você precisa se registrar e ser autorizado para acessar as informações de cada produto indicado pelo(a) profissional da saúde responsável.",
        order: 3,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: "Como funciona as etapas de consulta e tratamento?",
        answer: "O processo é simples: 1) Você agenda uma consulta médica com um profissional especializado, 2) Após a consulta, obtém a autorização da Anvisa para importação, 3) Nós processamos a importação e enviamos os produtos para você. Todo o processo é acompanhado de perto pela nossa equipe.",
        order: 4,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: "Qual o valor da consulta e autorização da Anvisa?",
        answer: "Os valores da consulta médica e da autorização da Anvisa variam conforme o profissional e o tipo de tratamento. Entre em contato conosco ou consulte diretamente o profissional de saúde para informações detalhadas sobre valores e processos.",
        order: 5,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: "Qual a validade da prescrição?",
        answer: "A validade da prescrição médica varia conforme a indicação do profissional e o tipo de produto. Geralmente, as prescrições têm validade de 6 a 12 meses, mas isso deve ser confirmado com o médico responsável. É importante manter as prescrições atualizadas para garantir o acesso contínuo aos produtos.",
        order: 6,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: "Qual é o prazo de entrega dos produtos",
        answer: "O prazo de entrega varia conforme a localização e o processo de importação. Geralmente, após a obtenção da autorização da Anvisa, o prazo de entrega é de 15 a 30 dias úteis. Para mais informações específicas sobre o seu pedido, entre em contato conosco.",
        order: 7,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
      console.log(`✅ Inserted ${faqs.insertedCount} FAQs`);
    } else {
      console.log(`⚠️  FAQs already exist (${faqCount} found). Skipping...`);
    }

    // Insert sample blog posts (skip if already exist)
    console.log('📝 Inserting sample blog posts...');
    const blogCount = await db.collection('blogs').countDocuments();
    if (blogCount === 0) {
      const blogs = await db.collection('blogs').insertMany([
      {
        title: "Cannabis Medicinal: Uma Abordagem Científica",
        slug: "cannabis-medicinal-abordagem-cientifica",
        contentMarkdown: `# Cannabis Medicinal: Uma Abordagem Científica

A cannabis medicinal tem ganhado cada vez mais atenção no Brasil e no mundo. Com base em pesquisas científicas robustas, os produtos à base de CBD (canabidiol) estão sendo utilizados para diversos fins terapêuticos.

## O que é CBD?

O CBD é um dos mais de 100 canabinoides encontrados na planta Cannabis. Diferente do THC, o CBD não produz efeitos psicoativos, tornando-o seguro para uso terapêutico.

## Benefícios Comprovados

Estudos científicos têm demonstrado que o CBD pode ajudar com:
- Bem-estar geral
- Equilíbrio mental e físico
- Melhoria do sono
- Foco e concentração

## Uso Responsável

É importante lembrar que o uso de produtos à base de CBD deve ser feito sempre sob orientação médica e com prescrição adequada.`,
        excerpt: "Entenda a ciência por trás da cannabis medicinal e como o CBD pode contribuir para seu bem-estar.",
        imageUrl: "https://via.placeholder.com/800x400?text=Blog+Post",
        tags: ["Cannabis", "CBD", "Saúde", "Bem-estar"],
        publishedAt: new Date(),
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Como Funciona o Processo de Autorização da Anvisa",
        slug: "processo-autorizacao-anvisa",
        contentMarkdown: `# Como Funciona o Processo de Autorização da Anvisa

O processo de autorização da Anvisa para importação de produtos à base de cannabis medicinal no Brasil segue regulamentações específicas.

## Passo a Passo

1. **Consulta Médica**: Primeiro, você precisa de uma consulta com um médico especializado
2. **Prescrição**: O médico prescreve o produto adequado para seu caso
3. **Autorização Anvisa**: Solicitação da autorização junto à Anvisa
4. **Importação**: Após a autorização, o produto pode ser importado
5. **Entrega**: Recebimento do produto no Brasil

## Documentos Necessários

- Prescrição médica
- Documentos pessoais
- Formulário da Anvisa preenchido

## Tempo de Processamento

O processo geralmente leva de 15 a 30 dias úteis.`,
        excerpt: "Aprenda como funciona todo o processo de autorização da Anvisa para importação de produtos de cannabis medicinal.",
        imageUrl: "https://via.placeholder.com/800x400?text=Anvisa",
        tags: ["Anvisa", "Autorização", "Importação", "Processo"],
        publishedAt: new Date(),
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
      console.log(`✅ Inserted ${blogs.insertedCount} blog posts`);
    } else {
      console.log(`⚠️  Blogs already exist (${blogCount} found). Skipping...`);
    }

    // Create indexes
    console.log('📊 Creating indexes...');
    
    await db.collection('products').createIndex({ slug: 1 }, { unique: true });
    await db.collection('products').createIndex({ visible: 1 });
    await db.collection('products').createIndex({ category: 1 });

    await db.collection('blogs').createIndex({ slug: 1 }, { unique: true });
    await db.collection('blogs').createIndex({ published: 1 });
    await db.collection('blogs').createIndex({ publishedAt: -1 });

    await db.collection('faqs').createIndex({ order: 1 });
    await db.collection('faqs').createIndex({ active: 1 });

    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ isAuthorized: 1 });
    await db.collection('users').createIndex({ role: 1 });

    await db.collection('auditlogs').createIndex({ createdAt: -1 });
    await db.collection('auditlogs').createIndex({ userId: 1 });
    await db.collection('auditlogs').createIndex({ action: 1 });

    await db.collection('bookings').createIndex({ userId: 1 });
    await db.collection('bookings').createIndex({ appointmentDate: 1 });
    await db.collection('bookings').createIndex({ status: 1 });
    await db.collection('bookings').createIndex({ userId: 1, appointmentDate: -1 });

    console.log('✅ Indexes created');

    // Verify data
    console.log('\n=== Database Setup Complete ===\n');
    console.log(`Products: ${await db.collection('products').countDocuments()}`);
    console.log(`FAQs: ${await db.collection('faqs').countDocuments()}`);
    console.log(`Blogs: ${await db.collection('blogs').countDocuments()}`);
    console.log(`Bookings: ${await db.collection('bookings').countDocuments()}`);
    console.log('\nCollections created:');
    console.log('  - users');
    console.log('  - products');
    console.log('  - orders');
    console.log('  - blogs');
    console.log('  - faqs');
    console.log('  - auditlogs');
    console.log('  - bookings');
    console.log('\n✅ Setup complete!');

    await mongoose.connection.close();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.code === 11000) {
      console.log('\n⚠️  Some data already exists. This is normal if you run the script multiple times.');
      console.log('The script will skip duplicate entries.');
    }
    await mongoose.connection.close();
    process.exit(1);
  }
}

setupDatabase();

