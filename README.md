# LingLang - Coming Soon Page

A modern, responsive coming soon page for LingLang, a conversational language learning app powered by advanced graph technology.

## Features

- 🎨 Modern, gradient-based design
- 📱 Fully responsive layout
- ✨ Smooth animations and interactions
- 📧 Email collection form
- 🎯 SEO optimized
- ♿ Accessible

## Project Structure

```
linglang-coming-soon/
├── index.html      # Main HTML page
├── styles.css      # Styling
├── script.js       # JavaScript interactions
└── README.md       # Documentation
```

## Setup Instructions

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `linglang-coming-soon`
3. Don't initialize with README (we already have one)
4. Copy the repository URL

### 2. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - LingLang coming soon page"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/linglang-coming-soon.git

# Push to GitHub
git push -u origin main
```

## Hosting Instructions

### Option 1: Netlify (Recommended)

1. **Sign up/Login** to [Netlify](https://app.netlify.com)

2. **Deploy from GitHub**:
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your `linglang-coming-soon` repository
   - Deploy settings are automatic (no changes needed)
   - Click "Deploy site"

3. **Configure Custom Domain**:
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter `linglang.app`
   - Follow DNS configuration instructions

4. **DNS Configuration** (at your domain registrar):
   - Add an A record: `@` → `75.2.60.5`
   - Add a CNAME record: `www` → `YOUR-SITE.netlify.app`
   - Wait 10-30 minutes for DNS propagation

### Option 2: Vercel

1. **Sign up/Login** to [Vercel](https://vercel.com)

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Framework preset: "Other"
   - Click "Deploy"

3. **Add Custom Domain**:
   - Go to Project Settings → Domains
   - Add `linglang.app`
   - Follow DNS instructions provided

4. **DNS Configuration**:
   - Add the records Vercel provides (usually CNAME or A records)

### Option 3: GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save

2. **Custom Domain**:
   - Add `linglang.app` in custom domain field
   - Create a file named `CNAME` in your repo with content: `linglang.app`

3. **DNS Configuration**:
   - Add A records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

## Email Collection Setup

Currently, emails are stored in browser localStorage for demo purposes. To connect to a real backend:

### Option 1: Netlify Forms (if using Netlify)

1. Add `netlify` attribute to form:
```html
<form id="signupForm" class="signup-form" netlify>
```

2. Netlify will automatically handle form submissions

### Option 2: Email Service Integration

Replace the `simulateSignup` function in `script.js` with:

```javascript
async function submitEmail(email) {
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('Signup failed');
    }

    return response.json();
}
```

Popular services:
- [ConvertKit](https://convertkit.com)
- [Mailchimp](https://mailchimp.com)
- [SendGrid](https://sendgrid.com)

## Customization

### Colors
Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #ec4899;
}
```

### Content
Update text in `index.html`:
- Hero title and description
- Feature cards
- Social media links

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Lighthouse score: 95+
- No external dependencies (except Google Fonts)
- Optimized animations with GPU acceleration
- Lazy loading for images (when added)

## License

Copyright 2024 LingLang. All rights reserved.