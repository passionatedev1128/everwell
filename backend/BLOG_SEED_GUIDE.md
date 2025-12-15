# Blog Seed Guide

Este guia explica como popular o banco de dados com os artigos do blog baseados no conteúdo do site Canva.

## 📝 Artigos Incluídos

O script irá criar 4 artigos do blog:

1. **Quem Pode Comprar Cannabis de Forma Legal no Brasil?**
   - Data: 19/09/2025
   - Tempo de leitura: ~3 minutos
   - Tags: Cannabis Medicinal, Legislação, Anvisa, Saúde

2. **Como adquirir Cannabis medicinal no Brasil (passo a passo)**
   - Data: 19/09/2025
   - Tempo de leitura: ~2 minutos
   - Tags: Guia, Passo a Passo, Cannabis Medicinal, Processo

3. **EverWell é a revolução do Wellness**
   - Data: 19/09/2025
   - Tempo de leitura: ~5 minutos
   - Tags: EverWell, Wellness, Inovação, Qualidade

4. **Chegamos! Inovação e qualidade para transformar sua rotina**
   - Data: 19/09/2025
   - Tempo de leitura: ~1 minuto
   - Tags: Lançamento, Inovação, Qualidade, EverWell

## 🚀 Como Executar

### Pré-requisitos

1. Certifique-se de que o MongoDB está rodando e acessível
2. Verifique se o arquivo `.env` está configurado com `MONGO_URI`

### Executar o Script

```bash
cd backend
npm run seed-blogs
```

### O que o Script Faz

- ✅ Conecta ao MongoDB
- ✅ Verifica se os artigos já existem (pula se já existirem)
- ✅ Cria os artigos que não existem
- ✅ Exibe um resumo do que foi criado

### Exemplo de Saída

```
✅ Conectado ao MongoDB
✅ Blog criado: "Quem Pode Comprar Cannabis de Forma Legal no Brasil?"
✅ Blog criado: "Como adquirir Cannabis medicinal no Brasil (passo a passo)"
✅ Blog criado: "EverWell é a revolução do Wellness"
✅ Blog criado: "Chegamos! Inovação e qualidade para transformar sua rotina"

📊 Resumo:
   ✅ Criados: 4
   ⏭️  Pulados: 0
   📝 Total: 4

✅ Desconectado do MongoDB
```

## 📋 Notas

- O script é **idempotente**: você pode executá-lo múltiplas vezes sem criar duplicatas
- Se um artigo já existir (mesmo slug), ele será pulado
- Todos os artigos são criados como **publicados** (`published: true`)
- As datas são definidas como 19/09/2025 (conforme o site Canva)

## 🔧 Personalização

Se você quiser modificar os artigos ou adicionar novos, edite o arquivo:

```
backend/scripts/seed-blogs.js
```

Adicione ou modifique objetos no array `blogPosts` seguindo a mesma estrutura.

## ✅ Verificação

Após executar o script, você pode verificar os artigos:

1. Acesse `/blog` no frontend
2. Ou faça uma requisição GET para `/api/blogs` no backend

Todos os artigos devem aparecer na página do blog!

