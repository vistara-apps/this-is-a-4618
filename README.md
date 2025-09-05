# LegalShield AI

**Your Pocket Guide to Rights & Responsibilities**

A mobile-first web application providing users with state-specific legal information and communication tools for interactions with law enforcement.

![LegalShield AI](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=LegalShield+AI)

## 🚀 Features

### Core Features
- **State-Specific Rights Guides**: Concise, mobile-optimized guides summarizing user rights and 'dos and don'ts' when interacting with law enforcement
- **In-the-Moment Communication Tools**: Pre-written scripts in English and Spanish for common law enforcement interaction scenarios
- **Location-Based Content Auto-Generation**: Automatically tailors legal rights information based on user's detected location
- **Quick Incident Recording & Sharing**: Swift recording of encounter details with audio recording and shareable summary cards

### Premium Features
- **AI-Generated Scripts**: Dynamic, personalized scripts using OpenAI
- **Unlimited Cloud Storage**: Store incident reports and audio recordings
- **Advanced Analytics**: Incident report analysis and feedback
- **Offline Access**: Download guides for offline use
- **Priority Support**: Direct access to legal resources

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI GPT-3.5/4 for dynamic content generation
- **Payments**: Stripe for subscription management
- **Storage**: Pinata (IPFS) for decentralized incident report storage
- **Location**: Browser Geolocation API with reverse geocoding

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)
- Pinata account (for IPFS storage)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-4618.git
cd this-is-a-4618
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Fill in your API keys in `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Pinata Configuration
VITE_PINATA_API_KEY=your_pinata_api_key_here
VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key_here

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema in `database/schema.sql` in your Supabase SQL editor
3. Create storage buckets for file uploads (see schema comments)

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── subscription/    # Payment and subscription components
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts (Auth, etc.)
├── data/               # Static data and configurations
├── services/           # API services and integrations
│   ├── supabase.js     # Database and auth
│   ├── openai.js       # AI content generation
│   ├── stripe.js       # Payment processing
│   ├── pinata.js       # IPFS storage
│   └── location.js     # Geolocation services
└── styles/             # CSS and styling
```

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the database schema from `database/schema.sql`
4. Configure Row Level Security policies
5. Create storage buckets for file uploads

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add it to your environment variables
3. Monitor usage to manage costs

### Stripe Setup

1. Create a Stripe account
2. Get your publishable key from the dashboard
3. Create subscription products and prices
4. Update the price IDs in `src/services/stripe.js`

### Pinata Setup

1. Create a Pinata account for IPFS storage
2. Get your API keys from the dashboard
3. Configure for incident report storage

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Netlify

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Docker

```bash
# Build the image
docker build -t legalshield-ai .

# Run the container
docker run -p 3000:3000 legalshield-ai
```

## 📱 Features in Detail

### State-Specific Rights Guides

- Automatically detects user location
- Provides state-specific legal information
- Covers common scenarios (traffic stops, street encounters, etc.)
- Available in English and Spanish

### Audio Recording

- Real-time audio recording during interactions
- Secure storage with IPFS backup
- Playback and sharing capabilities
- Browser-based recording (no app required)

### Incident Reporting

- Structured incident report creation
- AI-powered analysis and suggestions
- Shareable summary cards
- Secure, encrypted storage

### Subscription Management

- Free tier with basic features
- Premium tier with advanced AI features
- Stripe-powered billing
- Customer portal for subscription management

## 🔒 Security & Privacy

- End-to-end encryption for sensitive data
- IPFS storage for immutable incident records
- Row-level security in database
- No tracking or analytics without consent
- GDPR compliant data handling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [Wiki](https://github.com/vistara-apps/this-is-a-4618/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/vistara-apps/this-is-a-4618/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/vistara-apps/this-is-a-4618/discussions)

## 🙏 Acknowledgments

- Legal information sourced from public legal resources
- Icons by [Lucide](https://lucide.dev)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)

## ⚠️ Legal Disclaimer

This application provides general legal information and should not replace legal advice from a qualified attorney. In emergencies, always dial 911. For legal emergencies, contact a criminal defense attorney immediately.

---

**Built with ❤️ for civil rights and justice**
