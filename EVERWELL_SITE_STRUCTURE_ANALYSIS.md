# EverWell - Complete Site Structure Analysis

## 📋 Site Overview

**URL**: https://everwell.my.canva.site/everwell/  
**Platform**: Canva Site  
**Type**: Single-page application with hash-based navigation

---

## 🗺️ Navigation Structure

### Main Navigation Menu
1. **Home** → `#page-0` / `#home`
2. **Produtos** → `#page-1` (Restricted - requires login)
3. **Dúvidas** → `#page-3` (FAQ)
4. **Blog** → `#page-4`

### Primary CTA
- **AGENDAR CONSULTA** → External booking widget: `https://v0-booking-widget-frontend.vercel.app`

---

## 📄 PAGE STRUCTURE

### PAGE 0: HOME (#home / #page-0)

#### Header Section
- **Logo**: "EverWell"
- **Navigation**: Home | Produtos | Dúvidas | Blog
- **CTA Button**: "AGENDAR CONSULTA"

#### Section 1: Trust Badges (Top Banner)
Five trust indicators displayed:
1. **Suporte Médico Especializado**
2. **Entrega em todo o Brasil**
3. **Produtos Aprovados pela Anvisa**
4. **Compra 100% Segura**
5. **Embalagem Discreta**

#### Section 2: Hero Section
- **Main Headline**: "Focus. Performance. Recovery."
- **Tagline**: "EverWell, every day."
- **Description**: "Combinando ciência e inovação, criamos produtos à base de CBD que promovem bem-estar e alta performance, apoiando sua jornada pessoal ou profissional com qualidade de vida e resultados concretos."
- **CTA**: "Comece agora" (WhatsApp link)
- **WhatsApp Link**: `https://wa.me/5521998170460?text=Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20EverWell`

#### Section 3: Product Quality Statement
- **Heading**: "Produtos importados, testados e com qualidade reconhecida:"
- **Image**: Product imagery

#### Section 4: Value Proposition
- **Headline**: "Imagine" / "Unlock the power of our products"
- **Description**: "Criamos fórmulas que funcionam de verdade, com ingredientes naturais eficazes e propósito definido. Elaborados por especialistas e analisados lote a lote para garantir excelência."
- **CTA**: "SAIBA MAIS" → Links to Products page (#page-1)

#### Section 5: Purchase Process (3 Steps)
**Heading**: "As etapas de compra"

**Step 1**: "Compra Descomplicada"
- **Step 1a**: "Consulta Médica"
  - Link: `https://pro.quaddro.co/yourbestversion/servicos/vgwg3F`
- **Step 1b**: "Autorização da Anvisa"
  - Link: `https://pro.quaddro.co/yourbestversion/servicos/xUJjRT`

**Step 2**: "Importação e Entrega"
- Number indicators: "1", "2", "3"
- **CTA**: "Inicie agora" → Booking widget

#### Section 6: Objective Definition Form
- **Heading**: "defina seus objetivos"
- **Description**: "Compartilhe seus objetivos e histórico de saúde para que possamos criar a melhor estratégia de bem-estar e performance para você."
- **Sub-heading**: "Atinja sua melhor perfomance, seja pessoal ou profissional. Avance para seu próximo nível e se surpreenda do que você é capaz"
- **Formulário interno**: /api/leads/goals

#### Section 7: Products Preview
- **Heading**: "Produtos"
- **Product 1**: "Gummy" (with image)
- **Product 2**: "Óleo" (Oil - with image)
- **Product 3**: "Creme" (Cream - with image)
- **CTA**: "Conheça os produtos" → Links to Products page (#page-1)

#### Section 8: Customer Testimonials
**Testimonial 1**:
- Quote: "Tinha uma dor crônica nos braços que sumiram após algumas semanas. Muito Obrigado EverWell"
- Author: "Joana Fontes"

**Testimonial 2**:
- Quote: "As gomas me fizeram ter equílibrio mental e físico no meu dia-a-dia, agora consigo performar bem no meu trabalho"
- Author: "Maria Silva"

**Testimonial 3**:
- Quote: "Com a EverWell consigo me concentrar em meus estudos e dormir bem. Sou muito grato por conhecê-los"
- Author: "Antônio Santos"

#### Section 9: Why EverWell?
**Heading**: "Por que a EverWell ?"

Four key features:
1. **Qualidade é Inegociável**
2. **Transparência e Conformidade Legal**
3. **Foco em Wellness**
4. **Acompanhamento de Ponta a Ponta**

#### Section 10: Call to Action
- **Heading**: "Sua Melhor Versão começa agora!"

#### Section 11: Social Proof
- **Heading**: "Clientes Satisfeitos"
- Multiple customer images/logos

#### Section 12: FAQ Section
**Heading**: "Dúvidas Frequentes"

**Questions** (with expandable "+" indicators):
1. "O que é Cannabis Medicinal ?"
2. "Quais os principais benefícios dos produtos?"
3. "Preciso de receita médica para comprar os produtos da EverWell?"
4. "Como funciona as etapas de consulta e tratamento?"
5. "Qual o valor da consulta e autorização da Anvisa?"
6. "Qual a validade da prescrição?"
7. "Qual é o prazo de entrega dos produtos"

#### Footer Section
- **Legal Text**: "Termos e Condições para Profissionais da SaúdeTermos e Condições para Pacientes A EverWell não se destina a diagnósticar, tratar, curar ou previnir qualquer doença. Conectamos médicos e pacientes. Os medicamentos apresentados estão em estudo e já possuem milhares de pesquisas e casos comprovados mundialmente."
- **Copyright**: "Copyright 2025 EverWell. Todos os direitos reservados."
- **Links**: "Contato Política de Troca Política de Privacidade"
- **Brand**: "EverWell"

---

### PAGE 1: PRODUTOS (#page-1)
**Status**: RESTRICTED - Requires Login

**Access Requirements**:
- User must be logged in
- Registration required
- Product information is restricted per Anvisa regulations (RDC 327/2019 and 660/2022)

**Login Page Content** (when accessing restricted area):
- **Heading**: "Login"
- **Form Fields**:
  - E-mail (Email input)
  - senha (Password input)
- **CTA**: "FAZER LOGIN"
- **Secondary Links**:
  - "Esqueceu a senha?"
  - "Criar conta"
- **Information Text**: "Cadastre-se e acesse os produtos disponíveis!"
- **Legal Notice**: "Como solicitado pela Anvisa nas Resoluções da Diretoria Colegiada (RDC) 327/2019 e 660/2022 - todos os produtos são restritos e não podem haver propagandas. É por isso que você precisa se registrar para acessar as informações de cada produto indicado pelo(a) profissional da saúde responsável."

**Products Available** (from home page preview):
1. **Gummy** (Gummies)
2. **Óleo** (Oil)
3. **Creme** (Cream)

---

### PAGE 2: LOGIN/REGISTRATION (#page-2)
**Status**: Internal page (linked from restricted areas)

---

### PAGE 3: DÚVIDAS (#page-3)
**Status**: FAQ Page

**Content**: Similar to FAQ section on homepage, but likely expanded with more detailed answers.

---

### PAGE 4: BLOG (#page-4)
**Status**: Blog/Articles Section

**Purpose**: Educational content about cannabis medicinal, wellness, and products.

---

## 🔗 External Integrations

### 1. Booking System
- **URL**: `https://v0-booking-widget-frontend.vercel.app`
- **Purpose**: Medical consultation scheduling
- **Used in**: "AGENDAR CONSULTA" buttons

### 2. Service Platform (Quaddro)
- **Consulta Médica**: `https://pro.quaddro.co/yourbestversion/servicos/vgwg3F`
- **Autorização Anvisa**: `https://pro.quaddro.co/yourbestversion/servicos/xUJjRT`
- **Purpose**: Medical consultation and Anvisa authorization services

### 3. Formulários Internos
- **Formulário de Objetivos**: `/api/leads/goals` (envia email via Brevo/SMTP)
- **Purpose**: Collect user health objectives and history

### 4. WhatsApp Integration
- **Number**: +55 21 99817-0460
- **Link**: `https://wa.me/5521998170460?text=Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20EverWell`
- **Purpose**: Customer support and inquiries

---

## 📊 Content Structure Summary

### Homepage Sections (12 main sections):
1. Header with Navigation
2. Trust Badges
3. Hero Section
4. Product Quality Statement
5. Value Proposition
6. Purchase Process (3 Steps)
7. Objective Definition Form
8. Products Preview
9. Customer Testimonials
10. Why EverWell Features
11. Call to Action
12. FAQ Section
13. Footer

### Key Messages:
- **Focus**: Medical cannabis for wellness and performance
- **Trust**: Anvisa approved, legal, secure
- **Process**: Consultation → Authorization → Import → Delivery
- **Quality**: Imported, tested, professional-grade products

### Products:
1. **Gummy** (Gummies)
2. **Óleo** (Oil)
3. **Creme** (Cream)

---

## 🎯 Key Features Identified

### 1. Legal Compliance
- Anvisa approved products
- Restricted product access (login required)
- Legal disclaimers
- Medical consultation requirement

### 2. User Journey
- **Step 1**: Consultation booking
- **Step 2**: Anvisa authorization
- **Step 3**: Product import and delivery

### 3. Trust Building
- Customer testimonials
- Legal compliance badges
- Professional medical support
- Quality guarantees

### 4. Conversion Points
- "AGENDAR CONSULTA" buttons (multiple)
- "Comece agora" (WhatsApp)
- "SAIBA MAIS" (Learn more)
- "Conheça os produtos" (See products)
- "Inicie agora" (Start now)
- Objective definition form

---

## 📱 Technical Details

### Navigation System
- Hash-based routing (`#page-0`, `#page-1`, etc.)
- Single-page application structure
- Canva platform

### External Services
- Booking widget (Vercel)
- Service platform (Quaddro)
- Form service (formulário interno + notificação por email)
- WhatsApp integration

### Content Management
- Canva-based design
- Static content (texts, images)
- Dynamic integrations (booking, forms)

---

## 🔄 User Flow

1. **Landing** → Home page
2. **Browse** → View trust badges, hero, testimonials
3. **Learn** → Read FAQ, value proposition
4. **Action** → Click "AGENDAR CONSULTA" or "Comece agora"
5. **Booking** → External booking widget
6. **Consultation** → Medical consultation service
7. **Authorization** → Anvisa authorization service
8. **Login** → Access restricted products area
9. **Purchase** → View products (after login)

---

## 📝 Content to Preserve (Client Request)

### Text Content
- All blog articles
- All text content
- Product descriptions
- Testimonials
- FAQ content
- Legal disclaimers

### CTAs
- Can be improved/suggested
- Current CTAs should be maintained as baseline

---

## 🎨 Design Elements to Maintain

- Color scheme (can be updated)
- Layout structure
- Section organization
- Content hierarchy
- Trust indicators

---

This structure analysis provides the complete foundation for rebuilding the site in MERN stack while maintaining the existing content and structure.

