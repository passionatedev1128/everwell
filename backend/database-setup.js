// MongoDB Setup Script for Local Development
// Run this with: mongosh < database-setup.js
// Or use MongoDB Compass to run these queries

// ============================================
// 1. CREATE DATABASE
// ============================================
use everwell;

// ============================================
// 2. USER DOCUMENT STRUCTURE EXAMPLE
// ============================================
// Note: Users should be created via API (POST /api/auth/register)
// Password will be hashed with bcrypt automatically
// After registration, you can update user with complete information:

// Example user document structure includes:
// - name: String (required)
// - email: String (required, unique)
// - passwordHash: String (hashed by bcrypt)
// - phone: String
// - address: {
//     street: String,
//     city: String,
//     state: String,
//     zipCode: String,
//     country: String
//   }
// - documents: {
//     medicalPrescription: {
//       url: String,
//       uploadedAt: Date,
//       status: String (pending/approved/rejected)
//     },
//     importAuthorization: {
//       url: String,
//       uploadedAt: Date,
//       status: String (pending/approved/rejected)
//     },
//     proofOfResidence: {
//       url: String,
//       uploadedAt: Date,
//       status: String (pending/approved/rejected)
//     }
//   }
// - role: String (user/admin)
// - isAuthorized: Boolean

// ============================================
// 3. INSERT SAMPLE PRODUCTS
// ============================================
db.products.insertMany([
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

// ============================================
// 4. INSERT FAQS
// ============================================
db.faqs.insertMany([
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

// ============================================
// 5. INSERT SAMPLE BLOG POSTS
// ============================================
db.blogs.insertMany([
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

// ============================================
// 6. CREATE INDEXES FOR PERFORMANCE
// ============================================
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ visible: 1 });
db.products.createIndex({ category: 1 });

db.blogs.createIndex({ slug: 1 }, { unique: true });
db.blogs.createIndex({ published: 1 });
db.blogs.createIndex({ publishedAt: -1 });

db.faqs.createIndex({ order: 1 });
db.faqs.createIndex({ active: 1 });

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ isAuthorized: 1 });
db.users.createIndex({ role: 1 });

db.auditlogs.createIndex({ createdAt: -1 });
db.auditlogs.createIndex({ userId: 1 });
db.auditlogs.createIndex({ action: 1 });

// ============================================
// 7. EXAMPLE QUERIES FOR USER MANAGEMENT
// ============================================

// After registering a user via API, you can update with complete information:
// db.users.updateOne(
//   { email: "user@example.com" },
//   {
//     $set: {
//       phone: "+55 11 99999-9999",
//       address: {
//         street: "Rua das Flores, 123",
//         city: "São Paulo",
//         state: "SP",
//         zipCode: "01234-567",
//         country: "Brasil"
//       },
//       "documents.medicalPrescription": {
//         url: "https://cloudinary.com/everwell/user123/prescription.pdf",
//         uploadedAt: new Date(),
//         status: "pending"
//       },
//       "documents.importAuthorization": {
//         url: "https://cloudinary.com/everwell/user123/authorization.pdf",
//         uploadedAt: new Date(),
//         status: "pending"
//       },
//       "documents.proofOfResidence": {
//         url: "https://cloudinary.com/everwell/user123/residence.pdf",
//         uploadedAt: new Date(),
//         status: "pending"
//       }
//     }
//   }
// );

// To create admin user:
// 1. Register via API: POST /api/auth/register
// 2. Then update: db.users.updateOne({ email: "admin@everwell.com" }, { $set: { role: "admin", isAuthorized: true } });

// ============================================
// 8. VERIFY DATA
// ============================================
print("\n=== Database Setup Complete ===\n");
print("Products: " + db.products.countDocuments());
print("FAQs: " + db.faqs.countDocuments());
print("Blogs: " + db.blogs.countDocuments());
print("\nUser Schema includes:");
print("  - General Info: name, email, phone, address (street, city, state, zipCode, country)");
print("  - Documents: medicalPrescription, importAuthorization, proofOfResidence");
print("  - Each document has: url, uploadedAt, status (pending/approved/rejected)");
print("\nNext steps:");
print("  1. Register users via API: POST /api/auth/register");
print("  2. Update user info and documents via API or MongoDB");
print("  3. Create admin: Update role to 'admin' after registration");

