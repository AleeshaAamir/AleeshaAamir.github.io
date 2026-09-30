# Aleesha Aamir: Portfolio

Personal portfolio website for **Aleesha Aamir, Full Stack Developer**.
The design is based on my own Figma portfolio design.

**Stack:** HTML5, CSS3, vanilla JavaScript (frontend) · Node.js + Express (backend) · Nodemailer (email)

## Features

- Responsive layout for desktop, tablet and phone, with a dark/light theme toggle
- Sections: Hero, About, Services, Skills, Experience & Education, Projects, Design Work, Certifications, CV, Contact
- Project cards with filters and a case-study pop-up for each project
- Figma and graphic design gallery with a full-screen lightbox (keyboard arrows + Esc)
- CV preview with download button
- **Working contact form** with a backend API (`POST /api/contact`):
  - validation on both the browser and the server
  - spam protection (hidden honeypot field + rate limit of 5 messages per 15 minutes)
  - saves every message to `server/data/messages.json`
  - emails you each message when SMTP is configured
  - on static hosting with no backend, falls back to opening the visitor's email app
- Security headers (Helmet), SEO meta tags, accessibility (skip link, focus styles, reduced-motion support)

## Run it locally

```bash
npm install
npm start
```

Then open http://localhost:3000

## Receive contact messages by email (Gmail)

1. Turn on **2-Step Verification** on your Google account.
2. Create an **App Password**: https://myaccount.google.com/apppasswords
3. Copy `.env.example` to `.env` and paste the app password into `SMTP_PASS`.
4. Restart the server. `http://localhost:3000/api/health` should now show `"mail": true`.

Never commit `.env` to GitHub. It is already listed in `.gitignore`.

## Project structure

```
aleesha-portfolio/
├── public/                  # Frontend (served by Express)
│   ├── index.html
│   ├── css/style.css
│   ├── js/data.js           # ← Projects & gallery content: edit here
│   ├── js/main.js
│   └── assets/
│       ├── cv/Aleesha_Aamir_CV.pdf
│       └── img/ (profile, figma, graphics, projects)
├── server/
│   ├── server.js            # Express server + contact API
│   └── data/                # Saved contact messages
├── .env.example
└── package.json
```

## Updating content

- **Add or edit a project / design:** edit `public/js/data.js`.
- **Replace a project cover with a real screenshot:** save the screenshot in
  `public/assets/img/projects/` and update that project's `image` path in `data.js`.
- **Update the CV:** replace `public/assets/cv/Aleesha_Aamir_CV.pdf` (keep the same name).

## Deployment

The backend needs a Node.js host, for example:

- **Render** (free): New → Web Service → connect the GitHub repo → Build: `npm install`, Start: `npm start`. Add the `.env` values under *Environment*.
- **Railway** or **Cyclic**: similar steps.

You can also host only the `public/` folder on **GitHub Pages / Netlify / Vercel**.
Everything works there, except that the contact form opens the visitor's email app instead of sending through the API.
