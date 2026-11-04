# Taskote Website Content Management

This directory contains the complete editable content for the Taskote public website in English and Malayalam.

All visible text, headings, descriptions, buttons, navigation items, FAQs, category descriptions, and form labels are stored in clean JSON files here. You do **not** need to edit HTML, CSS, or JavaScript files to update text.

## Directory Structure

```
content/
├── en/                   # English content
│   ├── common.json       # Navigation, footer, buttons, common notices, search labels
│   ├── home.json         # Homepage copy (hero, popular, how it works, value props, CTAs)
│   ├── about.json        # About page (mission, vision, values, customer & pro benefits)
│   ├── services.json     # Services directory page header and search
│   ├── categories.json   # All 8 service category pages (covers, signs, prep steps, etc.)
│   ├── faq.json          # Frequently Asked Questions categorized
│   ├── contact.json      # Contact page details, placeholders, form labels
│   ├── auth.json         # Sign In and Get Started page copy
│   └── join.json         # For Professionals recruitment page copy
│
└── ml/                   # Native Malayalam content
    ├── common.json       # Malayalam navigation, footer, buttons, notices
    ├── home.json         # Malayalam homepage copy
    ├── about.json        # Malayalam about page copy
    ├── services.json     # Malayalam services directory copy
    ├── categories.json   # Malayalam service categories (AC Repair, Electrical, etc.)
    ├── faq.json          # Malayalam FAQ questions & answers
    ├── contact.json      # Malayalam contact page details & form labels
    ├── auth.json         # Malayalam Sign In & Get Started copy
    └── join.json         # Malayalam For Professionals copy
```

## How to Edit Malayalam or English Wording

1. Open the relevant JSON file in `content/ml/` (for Malayalam) or `content/en/` (for English).
2. Edit the heading, description, or button text.
3. Save the file (ensure your text editor saves in standard UTF-8 encoding).
4. Run the build command:
   ```bash
   npm run build
   ```
   Or from the root `public-site` directory:
   ```powershell
   npm run build
   ```
5. Preview the updated website locally:
   ```bash
   npm run serve
   ```
   Visit `http://localhost:4173/` (English) or `http://localhost:4173/ml/` (Malayalam).

## Guidelines for Malayalam Copywriters

- Keep phrasing natural, contemporary, and familiar to Kerala residents (homes, shops, offices).
- Retain commonly understood technical terms (e.g. AC Repair, MCB, Split AC, Socket, Filter) where Malayalam equivalents sound stiff.
- Avoid bureaucratic or overly Sanskritized vocabulary.
- Do not invent pricing, provider availability, or verification claims not supported by the Taskote platform.

