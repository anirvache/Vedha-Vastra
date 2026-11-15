# Saree Boutique Website

Storefront + simple admin + AI photo and description tools.

Quick start:
1. Install Node.js 20 or newer.
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and fill it in.
4. Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor.
5. Run `npm run dev` and open http://localhost:3000

The full step-by-step manual and rule book is the PDF delivered with this project.

Where to change things:
- Shop name, WhatsApp number, categories, colours list: `config/site.js`
- Turn AI tools on or off: `config/features.js`
- All the wording on the website: `content/texts.js`
- AI photo and description instructions: `prompts/photo.js` and `prompts/text.js`
- Colours, fonts, spacing: top of `app/globals.css`
