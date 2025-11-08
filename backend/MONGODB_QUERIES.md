# MongoDB Setup Queries for Local Development

## 🗄️ Quick Setup Guide

### Option 1: Using MongoDB Shell (mongosh)

```bash
# Connect to MongoDB
mongosh

# Run the setup script
mongosh < database-setup.js
```

### Option 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your local MongoDB instance
3. Create database `everwell`
4. Run queries below in each collection

### Option 3: Manual Setup

Follow the queries below to set up each collection manually.

---

## 📋 Step-by-Step Queries

### 1. Create Database

```javascript
use everwell;
```

---

### 2. Insert Products

```javascript
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
```

---

### 3. Insert FAQs

```javascript
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
```

---

### 4. Insert Sample Blog Posts

```javascript
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
```

---

### 5. Create Indexes for Performance

```javascript
// Products indexes
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ visible: 1 });
db.products.createIndex({ category: 1 });

// Blogs indexes
db.blogs.createIndex({ slug: 1 }, { unique: true });
db.blogs.createIndex({ published: 1 });
db.blogs.createIndex({ publishedAt: -1 });

// FAQs indexes
db.faqs.createIndex({ order: 1 });
db.faqs.createIndex({ active: 1 });

// Users indexes (will be created when users register)
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ isAuthorized: 1 });
db.users.createIndex({ role: 1 });

// Audit logs indexes
db.auditlogs.createIndex({ createdAt: -1 });
db.auditlogs.createIndex({ userId: 1 });
db.auditlogs.createIndex({ action: 1 });
```

---

### 6. Sample User Document Structure

The User model includes all required fields:

**General Registration Information:**
- `name` - Nome completo
- `email` - Email (unique, required)
- `phone` - Telefone
- `address` - Endereço completo:
  - `street` - Rua
  - `city` - Cidade
  - `state` - Estado
  - `zipCode` - CEP
  - `country` - País

**Documents:**
- `documents.medicalPrescription` - Receita médica
  - `url` - URL do documento
  - `uploadedAt` - Data do upload
  - `status` - Status (pending, approved, rejected)
- `documents.importAuthorization` - Autorização de importação
  - `url` - URL do documento
  - `uploadedAt` - Data do upload
  - `status` - Status (pending, approved, rejected)
- `documents.proofOfResidence` - Comprovante de residência
  - `url` - URL do documento
  - `uploadedAt` - Data do upload
  - `status` - Status (pending, approved, rejected)

**Note:** Users should be created via the API (POST `/api/auth/register`) because passwords are hashed with bcrypt. However, here's an example of a complete user document structure:

```javascript
// Example user document (DO NOT CREATE DIRECTLY - use API)
{
  name: "João Silva",
  email: "joao@example.com",
  passwordHash: "$2b$10$hashedpassword...", // Must be hashed with bcrypt
  phone: "+55 11 99999-9999",
  address: {
    street: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    country: "Brasil"
  },
  role: "user",
  isAuthorized: false,
  documents: {
    medicalPrescription: {
      url: "https://cloudinary.com/everwell/user123/prescription.pdf",
      uploadedAt: new Date("2025-01-15"),
      status: "pending"
    },
    importAuthorization: {
      url: "https://cloudinary.com/everwell/user123/authorization.pdf",
      uploadedAt: new Date("2025-01-16"),
      status: "pending"
    },
    proofOfResidence: {
      url: "https://cloudinary.com/everwell/user123/residence.pdf",
      uploadedAt: new Date("2025-01-15"),
      status: "pending"
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### 7. Create Admin User (After Registration)

**Important:** First register a user via the API, then run this query to make them admin:

```javascript
// Find the user by email and update role to admin
db.users.updateOne(
  { email: "admin@everwell.com" },
  { 
    $set: { 
      role: "admin",
      isAuthorized: true 
    } 
  }
);
```

### 8. Update User with Complete Registration Information

```javascript
// Update user with address information
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      phone: "+55 11 99999-9999",
      address: {
        street: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
        country: "Brasil"
      }
    }
  }
);
```

### 9. Update User Documents

```javascript
// Update medical prescription
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      "documents.medicalPrescription": {
        url: "https://cloudinary.com/everwell/user123/prescription.pdf",
        uploadedAt: new Date(),
        status: "pending"
      }
    }
  }
);

// Update import authorization
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      "documents.importAuthorization": {
        url: "https://cloudinary.com/everwell/user123/authorization.pdf",
        uploadedAt: new Date(),
        status: "pending"
      }
    }
  }
);

// Update proof of residence
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      "documents.proofOfResidence": {
        url: "https://cloudinary.com/everwell/user123/residence.pdf",
        uploadedAt: new Date(),
        status: "pending"
      }
    }
  }
);
```

### 10. Update Document Status

```javascript
// Approve medical prescription
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      "documents.medicalPrescription.status": "approved"
    }
  }
);

// Reject document
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      "documents.medicalPrescription.status": "rejected"
    }
  }
);
```

---

### 11. Verify Data

```javascript
// Check counts
db.products.countDocuments();
db.faqs.countDocuments();
db.blogs.countDocuments();
db.users.countDocuments();

// View all products
db.products.find().pretty();

// View all FAQs
db.faqs.find().pretty();

// View all blogs
db.blogs.find().pretty();

// View all users
db.users.find().pretty();
```

---

### 12. Useful Queries

#### Find all authorized users
```javascript
db.users.find({ isAuthorized: true }).pretty();
```

#### Find all pending users
```javascript
db.users.find({ isAuthorized: false }).pretty();
```

#### Find admin users
```javascript
db.users.find({ role: "admin" }).pretty();
```

#### Find users with incomplete documents
```javascript
db.users.find({
  $or: [
    { "documents.medicalPrescription.url": { $exists: false } },
    { "documents.importAuthorization.url": { $exists: false } },
    { "documents.proofOfResidence.url": { $exists: false } }
  ]
}).pretty();
```

#### Find users with pending documents
```javascript
db.users.find({
  $or: [
    { "documents.medicalPrescription.status": "pending" },
    { "documents.importAuthorization.status": "pending" },
    { "documents.proofOfResidence.status": "pending" }
  ]
}).pretty();
```

#### Find users with all documents approved
```javascript
db.users.find({
  "documents.medicalPrescription.status": "approved",
  "documents.importAuthorization.status": "approved",
  "documents.proofOfResidence.status": "approved"
}).pretty();
```

#### Update user authorization
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isAuthorized: true } }
);
```

#### Remove authorization
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isAuthorized: false } }
);
```

#### Get user with all registration information
```javascript
db.users.findOne(
  { email: "user@example.com" },
  {
    name: 1,
    email: 1,
    phone: 1,
    address: 1,
    documents: 1,
    isAuthorized: 1,
    createdAt: 1
  }
).pretty();
```

#### Delete all test data (use with caution!)
```javascript
db.products.deleteMany({});
db.faqs.deleteMany({});
db.blogs.deleteMany({});
db.users.deleteMany({});
db.auditlogs.deleteMany({});
```

---

## 🚀 Quick Setup Script

Save all queries to `database-setup.js` and run:

```bash
mongosh < database-setup.js
```

Or use MongoDB Compass to execute each section.

---

## ✅ Verification Checklist

After running the setup:

- [ ] Database `everwell` created
- [ ] 3 products inserted
- [ ] 7 FAQs inserted
- [ ] 2 blog posts inserted
- [ ] All indexes created
- [ ] User registered via API
- [ ] User role updated to admin
- [ ] Can login and access admin panel
- [ ] Can authorize users
- [ ] Authorized users can access products

---

## 📝 Notes

1. **Users**: Don't create users directly in MongoDB. Use the registration API, then update role to admin.

2. **Passwords**: Passwords are hashed with bcrypt. Always use the API for user creation.

3. **Images**: Replace placeholder URLs with actual product images later.

4. **Content**: Blog posts use Markdown format. Update content as needed.

5. **Indexes**: Indexes improve query performance. Always create them.

---

**Setup complete!** Your database is ready for local development. 🎉

