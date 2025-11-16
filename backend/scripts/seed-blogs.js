import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Blog from '../models/Blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const blogPosts = [
  {
    title: 'Quem Pode Comprar Cannabis de Forma Legal no Brasil?',
    slug: 'quem-pode-comprar-cannabis-de-forma-legal-no-brasil',
    excerpt: 'Hoje, milhares de brasileiros já utilizam cannabis medicinal de forma legal para tratar diferentes condições de saúde. E não estamos falando apenas de doenças raras ou graves.',
    contentMarkdown: `# Quem Pode Comprar Cannabis de Forma Legal no Brasil?

Hoje, milhares de brasileiros já utilizam cannabis medicinal de forma legal para tratar diferentes condições de saúde. E não estamos falando apenas de doenças raras ou graves. **Problemas muito comuns como ansiedade, insônia, estresse crônico, dores musculares e até TPM já fazem parte das principais indicações.**

Ainda assim, o tema é cercado de dúvidas. Uma das maiores é acreditar que somente pacientes com câncer, epilepsia ou doenças terminais têm direito ao uso da cannabis. **Na prática, isso não é verdade.**

---

## Afinal, quem pode comprar cannabis legalmente no Brasil?

> **A resposta é direta: qualquer pessoa com prescrição médica.**

A legislação atual permite que médicos de qualquer especialidade prescrevam produtos à base de cannabis. Esses produtos devem estar enquadrados como de uso medicinal e autorizados para importação pela Anvisa.

**Ou seja, não há uma lista fechada de doenças que autorizam o uso.** O critério é sempre o bem-estar do paciente. Se o médico entender que a cannabis pode contribuir para a melhora da qualidade de vida, ele pode prescrever.

---

## Condições comuns tratadas com cannabis medicinal

Algumas das indicações mais frequentes incluem:

### Bem-estar Mental
- 🧠 **Controle da Ansiedade** - Redução de sintomas de ansiedade e pânico
- 😌 **Tranquilidade Mental** - Equilíbrio emocional e mental
- 💡 **Aumento do Foco** - Melhora na concentração e clareza mental
- ✨ **Aumento da Criatividade** - Estimulação do pensamento criativo

### Saúde Física
- 💤 **Melhoria do Sono** - Tratamento de insônia e distúrbios do sono
- 🏃 **Recuperação Muscular** - Aceleração da recuperação pós-treino
- 💪 **Energia e Disposição** - Aumento de vitalidade e energia
- 🛡️ **Imunidade e Vitalidade** - Fortalecimento do sistema imunológico

### Performance e Qualidade de Vida
- 🏋️ **Melhoria Esportiva** - Otimização do desempenho atlético
- 🎯 **Controle de Dor Crônica** - Alívio de dores persistentes
- 📉 **Diminuição do Stress** - Redução dos níveis de estresse
- 🌸 **Controle da TPM** - Alívio de sintomas pré-menstruais
- ❤️ **Aumento da Libido** - Melhoria da vida sexual

> **📊 Dado importante:** De acordo com um relatório da Kaya Mind (2023), **mais de 100 mil brasileiros já possuem autorização da Anvisa** para importar cannabis medicinal e esse número não para de crescer.

---

## Como comprar cannabis legal no Brasil?

O processo é muito mais simples do que se imagina. Siga estes três passos:

### 1️⃣ Consulta médica

Qualquer médico pode prescrever cannabis. Hoje já existem inclusive **clínicas especializadas** nesse tipo de tratamento, facilitando o acesso para quem busca essa alternativa.

### 2️⃣ Receita e autorização da Anvisa

Com a receita em mãos, o paciente deve solicitar a autorização online. **Em muitos casos, a aprovação sai no mesmo dia**, tornando o processo ágil e descomplicado.

### 3️⃣ Compra em sites autorizados

Durante a compra, basta anexar a receita médica. O produto é **importado e entregue legalmente em sua casa**, com toda a segurança e rastreabilidade.

> **💡 Curiosidade:** A Anvisa já autorizou **mais de 100 produtos diferentes** à base de cannabis para importação, com concentrações variadas de THC e CBD, possibilitando adequar o tratamento à necessidade de cada paciente.

---

## Conclusão

A cannabis medicinal já é uma realidade para milhares de brasileiros. Se você sofre com ansiedade, insônia, estresse ou dores crônicas, **pode conversar com um médico e avaliar se o tratamento é indicado para o seu caso.**

A EverWell está aqui para facilitar todo esse processo, oferecendo suporte especializado desde a consulta até a entrega dos produtos. **Sua jornada rumo ao bem-estar pode começar hoje.**`,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cannabis Medicinal', 'Legislação', 'Anvisa', 'Saúde'],
    published: true,
    publishedAt: new Date('2025-09-19')
  },
  {
    title: 'Como adquirir Cannabis medicinal no Brasil (passo a passo)',
    slug: 'como-adquirir-cannabis-medicinal-no-brasil-passo-a-passo',
    excerpt: 'A EverWell oferece canabinoides de forma legal e segura ao público brasileiro. Para comprar no Brasil, é preciso seguir o fluxo de prescrição e autorização da Anvisa.',
    contentMarkdown: `# Como adquirir Cannabis medicinal no Brasil (passo a passo)

A EverWell oferece canabinoides de forma legal e segura ao público brasileiro. Para comprar no Brasil, é preciso seguir o fluxo de prescrição e autorização da Anvisa. Abaixo, o **passo a passo atualizado e completo** para facilitar sua jornada.

---

## 1️⃣ Consulta e prescrição

Agende consulta com médico (ou dentista). O profissional avaliará seu caso e, se indicado, emitirá prescrição (receita) contendo **obrigatoriamente:**

- ✅ Nome completo do paciente
- ✅ Nome comercial do produto (específico)
- ✅ Posologia (dose diária recomendada)
- ✅ Data, assinatura e número de registro (CRM/CRO)

> **⚠️ Dica importante:** A Anvisa exige receita com **nome comercial específico**. Não vale apenas "CBD", "óleo de cannabis" ou termos genéricos. O produto deve estar claramente identificado na receita.

---

## 2️⃣ Autorização da Anvisa (on‑line)

Com a receita em mãos, faça seu cadastro no **Portal de Serviços gov.br** e solicite a Autorização de Importação de produtos derivados de cannabis.

### Informações importantes:

- **📅 Validade:** 2 anos
- **⏱️ Prazos:** 
  - Quando o produto está na lista predefinida do sistema, o comprovante pode sair **automaticamente**
  - Se não estiver, a Anvisa faz análise (a etapa pode levar até 10 dias e o serviço indica até 20 dias como prazo total estimado)

> **ℹ️ Importante:** A Anvisa apenas **autoriza a importação**; não fornece nem endossa produtos. A compra deve ser realizada em sites autorizados.

---

## 3️⃣ Compra no site da EverWell

Com a autorização válida em mãos, você está pronto para realizar sua compra:

### Processo de compra:

1. **Escolha os produtos** conforme sua receita médica
2. **No checkout**, envie as cópias digitais de:
   - 📄 RG ou documento de identidade
   - 🏠 Comprovante de residência
   - 💊 Receita médica
   - ✅ Autorização da Anvisa
3. **Finalize o pedido** e aguarde a entrega legal e rastreável ao seu endereço

> **📋 Observação:** Somente itens compatíveis com a prescrição serão enviados (quantidade e concentração). A EverWell garante total conformidade com as regulamentações.

---

## Nota regulatória

> **📜 Base legal:** RDC 660/2022 (importação excepcional por pessoa física, com prescrição). 
> 
> Este conteúdo é informativo e não substitui orientação médica ou legal. Verifique sempre as páginas oficiais da Anvisa para eventuais atualizações de prazos e requisitos.

---

## Pronto para começar?

A EverWell está aqui para facilitar cada etapa do processo. **Agende sua consulta** e descubra como podemos ajudar você a ter acesso a produtos de cannabis medicinal de forma legal, segura e com total suporte especializado.`,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
    tags: ['Guia', 'Passo a Passo', 'Cannabis Medicinal', 'Processo'],
    published: true,
    publishedAt: new Date('2025-09-19')
  },
  {
    title: 'EverWell é a revolução do Wellness',
    slug: 'everwell-e-a-revolucao-do-wellness',
    excerpt: 'O mercado de cannabis medicinal no Brasil cresce a cada ano, acompanhando uma tendência global de busca por alternativas naturais e eficazes para saúde, performance e qualidade de vida.',
    contentMarkdown: `# EverWell é a revolução do Wellness

O mercado de cannabis medicinal no Brasil cresce a cada ano, acompanhando uma tendência global de busca por alternativas naturais e eficazes para saúde, performance e qualidade de vida. Nesse cenário, **a EverWell chega ao país trazendo tecnologia, ciência e inovação** no desenvolvimento de produtos à base de CBD.

Com a autorização da Anvisa, agora é possível receber produtos da EverWell de forma **legal, segura e direta em casa**, ampliando o acesso de pacientes e consumidores a uma solução que já transforma a vida de milhões de pessoas pelo mundo.

---

## O que é a EverWell?

A EverWell é uma empresa especializada em produtos à base de cannabis, com foco em entregar **bem-estar, saúde e performance**. Diferente de marcas comuns, a EverWell se destaca por:

### ✨ Tecnologia e Ciência
- Produtos desenvolvidos com **tecnologia de ponta e rigor científico**
- Testes em **laboratórios independentes** que asseguram pureza e eficácia

### 🎯 Soluções Completas
- Uma linha completa de soluções voltadas para **relaxamento, dores, ansiedade, foco e recuperação muscular**

### 🏆 Compromisso com Qualidade
- **Compromisso com qualidade, inovação e transparência** em cada etapa da produção

---

## Benefícios dos produtos EverWell

Os produtos EverWell são formulados para atuar em diversas áreas da saúde e da vida cotidiana. Entre os principais benefícios estão:

### 1. 🌿 Relaxamento e bem-estar

O CBD atua no sistema endocanabinoide, regulando processos essenciais do organismo e promovendo **equilíbrio físico e mental**. Ideal para quem busca uma sensação de calma e bem-estar no dia a dia.

### 2. 💊 Alívio de dores

Pacientes com condições como artrite ou dores musculares encontram no CBD um **aliado natural**, com propriedades analgésicas e anti-inflamatórias comprovadas.

### 3. 😴 Melhora da qualidade do sono

O CBD ajuda no tratamento da insônia e promove um **sono mais profundo e reparador**, essencial para quem busca mais energia e disposição no dia a dia.

### 4. 🧘 Redução da ansiedade

Comprovado em estudos, o canabidiol auxilia no controle da ansiedade e estresse, favorecendo o **equilíbrio emocional e mental**.

### 5. 🚀 Aumento de performance

Atletas e profissionais de alta performance já utilizam o CBD como suporte para **foco, resistência e clareza mental**, potencializando resultados.

### 6. 💪 Recuperação muscular

Após treinos ou esforço físico intenso, o CBD **acelera a recuperação muscular** e reduz dores pós-exercício, permitindo treinos mais frequentes e intensos.

---

## Por que escolher a EverWell?

Em um mercado que cresce rapidamente, é essencial optar por uma marca que ofereça **confiabilidade e resultados reais**.

> A EverWell se diferencia porque trabalha com **ingredientes naturais e estáveis**, cada um com finalidade específica, entrega **produtos premium analisados lote a lote**, e une **ciência, tecnologia e inovação** para transformar a forma como você se relaciona com a cannabis medicinal.

### Nossos diferenciais:

- 🌱 **Ingredientes naturais** - Cada componente com finalidade específica
- 🔬 **Produtos premium** - Analisados lote a lote
- 🧪 **Ciência e tecnologia** - Inovação em cada formulação
- 📊 **Transparência total** - Processos claros e rastreáveis

---

## Conclusão: transforme sua rotina com a EverWell

O CBD não é apenas uma tendência, mas uma **realidade que vem mudando vidas**. Seja para controlar dores crônicas, melhorar o sono, reduzir a ansiedade ou potencializar performance e recuperação, os produtos da EverWell são desenvolvidos para **entregar resultados de verdade**.

Com a chegada da marca ao Brasil, você tem acesso a uma **nova experiência de bem-estar**, com suporte especializado e produtos de alta qualidade.

> **Conheça a EverWell e descubra como a cannabis medicinal pode transformar sua rotina.** Sua jornada rumo ao wellness começa aqui.`,
    imageUrl: 'https://images.unsplash.com/photo-1617653513183-0e3d963902df?auto=format&fit=crop&w=1200&q=80',
    tags: ['EverWell', 'Wellness', 'Inovação', 'Qualidade'],
    published: true,
    publishedAt: new Date('2025-09-19')
  },
  {
    title: 'Chegamos! Inovação e qualidade para transformar sua rotina',
    slug: 'chegamos-inovacao-e-qualidade-para-transformar-sua-rotina',
    excerpt: 'Somos a EverWell, uma startup que desenvolve produtos inovadores à base de cbd. E agora, com a autorização da Anvisa, nossos produtos podem chegar até você de forma legal, segura e direta.',
    contentMarkdown: `# Chegamos! Inovação e qualidade para transformar sua rotina

Somos a **EverWell**, uma startup que desenvolve produtos inovadores à base de CBD. E agora, com a autorização da Anvisa, nossos produtos podem chegar até você de forma **legal, segura e direta**.

---

## Nossa missão

> Nossa missão é ir além do bem-estar: queremos apoiar sua rotina de performance, melhorar seu foco, contribuir para a recuperação muscular e elevar sua qualidade de vida. Tudo isso com a confiança de uma marca que **une ciência, tecnologia e inovação**.

---

## O que oferecemos

### 🎯 Performance
Apoiamos sua rotina de performance com produtos desenvolvidos para atletas e profissionais de alta performance.

### 🧠 Foco
Melhoramos seu foco e clareza mental através de formulações científicas comprovadas.

### 💪 Recuperação
Contribuímos para a recuperação muscular, acelerando o processo pós-treino e reduzindo dores.

### ✨ Qualidade de Vida
Elevamos sua qualidade de vida com soluções naturais e eficazes.

---

## Estamos prontos

Estamos prontos para **transformar a maneira como você se relaciona com a cannabis medicinal**.

A EverWell chegou para fazer a diferença. **Sua jornada rumo ao bem-estar começa agora.**

> 💚 **Bem-vindo à EverWell. Inovação e qualidade para transformar sua rotina.**`,
    imageUrl: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Lançamento', 'Inovação', 'Qualidade', 'EverWell'],
    published: true,
    publishedAt: new Date('2025-09-19')
  }
];

const seedBlogs = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI não encontrada no arquivo .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Clear existing blogs (optional - comment out if you want to keep existing)
    // await Blog.deleteMany({});
    // console.log('🗑️  Blogs existentes removidos');

    // Insert blog posts
    let created = 0;
    let skipped = 0;

    for (const blogData of blogPosts) {
      const existingBlog = await Blog.findOne({ slug: blogData.slug });
      
      if (existingBlog) {
        console.log(`⏭️  Blog "${blogData.title}" já existe, pulando...`);
        skipped++;
      } else {
        await Blog.create(blogData);
        console.log(`✅ Blog criado: "${blogData.title}"`);
        created++;
      }
    }

    console.log('\n📊 Resumo:');
    console.log(`   ✅ Criados: ${created}`);
    console.log(`   ⏭️  Pulados: ${skipped}`);
    console.log(`   📝 Total: ${blogPosts.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Desconectado do MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular blogs:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed function
seedBlogs();
