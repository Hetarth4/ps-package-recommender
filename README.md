# ThoughtSpot PS Package Recommender

A beautiful, modern React application for recommending ThoughtSpot Professional Services packages based on customer requirements. Built with Next.js and styled to match ThoughtSpot's dark mode design.

## Features

✨ **Modern UI** - Sleek dark mode design matching ThoughtSpot's aesthetics
🎯 **Smart Recommendations** - Algorithm-based package recommendations
💡 **Interactive Tooltips** - Helpful context on hover for every field
📊 **ACV Validation** - Validate recommendations against Annual Contract Value
🎨 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
🚀 **Fast & Optimized** - Built with Next.js for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Clone the repository** (or download the files)
   ```bash
   git clone <your-repo-url>
   cd thoughtspot-ps-recommender
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Deploying to Vercel

### Method 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** to link your project

### Method 2: Deploy via GitHub + Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js settings
   - Click "Deploy"

3. **Your app is live!**
   Vercel will provide you with a production URL

## Hosting on GitHub

Your code is already configured for GitHub hosting:

1. **Create a new repository** on GitHub
2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

## Project Structure

```
thoughtspot-ps-recommender/
├── app/
│   ├── globals.css          # Global styles with ThoughtSpot theme
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Main page
│   └── page.module.css       # Page-specific styles
├── components/
│   ├── Header.tsx            # Header with ThoughtSpot logo
│   ├── Header.module.css
│   ├── TabNavigation.tsx     # Tab system for future expansion
│   ├── TabNavigation.module.css
│   ├── Tooltip.tsx           # Interactive tooltip component
│   ├── Tooltip.module.css
│   ├── PSPackageRecommender.tsx  # Main form and logic
│   └── PSPackageRecommender.module.css
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## Customization

### Adding New Tabs

The app is structured to support multiple tabs. To add a new tab:

1. Open `components/TabNavigation.tsx`
2. Add your tab to the `tabs` array:
   ```typescript
   const tabs = [
     { id: 'ps-package', label: 'PS Package Recommender' },
     { id: 'your-tab', label: 'Your New Tab' },
   ]
   ```

### Updating Colors

All ThoughtSpot colors are defined in `app/globals.css` as CSS variables:
- `--ts-background`: Main background color
- `--ts-primary`: Primary brand color
- `--ts-text-primary`: Main text color
- And more...

### Modifying Form Fields

Form fields and scoring logic are in `components/PSPackageRecommender.tsx`. Each dropdown has:
- Options object with scoring values
- Tooltip content for user guidance

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Deployment**: Vercel-optimized

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to submit issues and enhancement requests!

## License

Proprietary - ThoughtSpot Internal Use

## Support

For questions or support, contact the PS team:
- **NA**: MJ Densmore, Carolyn Chupa
- **EMEA**: Camilla Tanzi, Hetarth Chokshi
- **Scale**: Arjun Krishnan

---

Built with ❤️ for ThoughtSpot






