# ⚡ ResumeForge

A full-featured resume builder with AI bullet generator, ATS analyzer, keyword matching, 10 templates, and public resume hosting.

---

## 🚀 Quick Setup (5 minutes)

### Step 1 — Set up Supabase Database

1. Go to your Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Paste the entire contents of `supabase-setup.sql`
4. Click **Run**

This creates the `resumes` and `users` tables with Row Level Security policies.

### Step 2 — Enable Email Auth

1. Supabase Dashboard → **Authentication → Providers**
2. Make sure **Email** is enabled
3. Optionally disable "Confirm email" for easier testing (Auth → Settings → Disable email confirmations)

### Step 3 — Deploy to GitHub Pages

1. Push this entire `resume-builder/` folder to a GitHub repository
2. Go to repository **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Your app will be live at `https://yourusername.github.io/your-repo/`

Or simply open `index.html` directly in a browser for local testing.

---

## 📁 File Structure

```
resume-builder/
├── index.html          # Login / Sign up page
├── dashboard.html      # Resume management dashboard
├── builder.html        # Resume editor (main app)
├── resume.html         # Public resume viewer
├── supabase-setup.sql  # Database setup script
├── css/
│   ├── main.css        # Global styles, auth, dashboard
│   ├── builder.css     # Builder layout & tool panels
│   └── templates.css   # All 10 resume template styles
└── js/
    ├── config.js        # Supabase client setup
    ├── auth.js          # Login / signup / forgot password
    ├── dashboard.js     # Dashboard logic
    ├── builder.js       # Main builder logic
    ├── templates.js     # All 10 resume renderers
    ├── ats-checker.js   # ATS score analyzer
    ├── keyword-checker.js  # Job description keyword matcher
    ├── ai-generator.js  # Mock AI bullet generator
    └── export.js        # PDF, print, plain text export
```

---

## ✨ Features

| Feature | Description |
|---|---|
| **10 Templates** | Classic ATS, Modern, Corporate, Creative, Graduate, Executive, Tech, Marketing, Designer, Compact |
| **Live Preview** | See your resume update in real-time as you type |
| **AI Bullet Generator** | Generate strong resume bullets by role and task |
| **ATS Analyzer** | Score your resume 0-100 with specific improvement tips |
| **Keyword Matcher** | Paste a job description and see matched/missing keywords |
| **PDF Export** | High-quality PDF via html2pdf.js |
| **Plain Text Export** | ATS-friendly `.txt` version |
| **Public Resume Link** | One-click publish + shareable URL |
| **Auto-save** | Changes saved automatically every 1.5 seconds |
| **Template Customization** | 12 accent colors + custom color picker + font options |

---

## 🗄 Database Schema

### `resumes` table
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | References auth.users |
| `title` | TEXT | Resume display name |
| `data_json` | JSONB | All resume content |
| `template` | TEXT | Selected template key |
| `is_public` | BOOLEAN | Published online? |
| `public_slug` | TEXT | URL slug for public link |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last save timestamp |

### `data_json` Structure
```json
{
  "personal": {
    "fullName": "", "title": "", "email": "",
    "phone": "", "location": "", "linkedin": "",
    "portfolio": "", "summary": ""
  },
  "experience": [{
    "company": "", "position": "",
    "startDate": "", "endDate": "", "current": false,
    "bullets": []
  }],
  "education": [{
    "school": "", "degree": "", "field": "",
    "startDate": "", "endDate": "", "honors": ""
  }],
  "skills": {
    "technical": [], "soft": [], "tools": [], "languages": []
  },
  "projects": [{
    "name": "", "description": "", "technologies": "", "link": ""
  }],
  "certifications": [{
    "name": "", "issuer": "", "year": ""
  }]
}
```

---

## 🎨 The 10 Templates

1. **Classic ATS** — Traditional, ATS-optimized layout with center header
2. **Modern Minimal** — Clean lines, left-accented bullets, skills grid
3. **Corporate** — Dark navy header, structured sections, pill skills
4. **Creative** — Two-column with colored sidebar and avatar initials
5. **Graduate** — Academic serif style, education-first layout
6. **Executive** — Elegant serif, double rule header, luxury feel
7. **Tech Developer** — Terminal-themed dark header, code-inspired
8. **Marketing Pro** — Bold typography, colored skills badges
9. **Designer Portfolio** — Grid layout with colored sidebar
10. **Compact One-Page** — Dense layout, maximizes content in one page

---

## 🔧 Customization

Each template supports:
- **12 preset accent colors** + custom color picker
- **8 font family options** (serif, sans-serif, monospace)
- **Font size control** (9–13pt)

---

## 📤 Public Resume Hosting

When you publish a resume:
- A unique 8-character slug is generated
- Public URL: `your-site.com/resume.html?slug=abc12345`
- Anyone with the link can view and download your resume as PDF
- Toggle public/private from the dashboard at any time
