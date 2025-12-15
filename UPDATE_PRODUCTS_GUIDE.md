# Guide to Update Products from Canva Site

## Overview
This guide explains how to update the product database with information from the Canva site (https://everwell.my.canva.site/everwell/#page-2).

## Products from Canva Site

### 1. Gummy de CBD e THC
- **Subtitle:** Sono Profundo, noites reparadoras
- **Description:** Desenvolvida para promover noites de sono mais profundas e reparadoras. Sua fórmula equilibrada combina relaxamento natural, redução do estresse e suporte ao bem-estar, ajudando você a acordar renovado e com mais energia para o dia.
- **Price:** R$ 330,00
- **Category:** gummy

### 2. Creme CBD + CBG + CBN + CBC
- **Subtitle:** Alívio instântaneo e recuperação rápida
- **Description:** Formulado para potencializar a recuperação muscular, aliviar dores e agir como anti-inflamatório natural. Composto por fitocanabinoides e terpenos que atuam em sinergia, promove equilíbrio, bem-estar e suporte diário para quem busca performance e qualidade de vida.
- **Price:** R$ 330,00
- **Category:** creme

### 3. Óleo de CBD e CBG
- **Subtitle:** Foco aumentado e performance contínua.
- **Description:** Ideal para quem busca foco, concentração e resistência ao longo do dia. Com fórmula pura e precisa, auxilia no equilíbrio mental e físico, reduz distrações e promove clareza, energia sustentável e desempenho superior em cada desafio.
- **Price:** R$ 330,00
- **Category:** oleo

## Database Changes

### Product Model Updates
- Added `price` field (Number, required, min: 0)
- Added `subtitle` field (String, optional)

## How to Update Database

### Option 1: Run the Update Script (Recommended)

```bash
cd backend
node scripts/update-products-from-canva.js
```

This script will:
- Update existing products with matching slugs
- Create new products if they don't exist
- Remove old products that are not in the new list
- Preserve all other products

### Option 2: Manual MongoDB Update

Connect to MongoDB and run:

```javascript
use everwell;

// Update or insert products
db.products.updateOne(
  { slug: "gummy-cbd-thc" },
  {
    $set: {
      name: "Gummy de CBD e THC",
      subtitle: "Sono Profundo, noites reparadoras",
      description: "Desenvolvida para promover noites de sono mais profundas e reparadoras. Sua fórmula equilibrada combina relaxamento natural, redução do estresse e suporte ao bem-estar, ajudando você a acordar renovado e com mais energia para o dia.",
      price: 330.00,
      category: "gummy"
    }
  },
  { upsert: true }
);

// Repeat for other products...
```

## Frontend Updates

The following components have been updated to display the new product information:

1. **ProductCard.jsx** - Shows subtitle and price
2. **ProductDetail.jsx** - Shows subtitle and price in product detail page

## Testing

After updating the database:

1. Restart the backend server
2. Clear browser cache
3. Navigate to `/produtos` page
4. Verify all 3 products are displayed with:
   - Correct names
   - Subtitles
   - Descriptions
   - Prices (R$ 330,00)
   - Images

## Notes

- All products have the same price: R$ 330,00
- Product images use placeholder URLs from Unsplash
- You may want to replace these with actual product images
- The script preserves existing products that don't match the new list

