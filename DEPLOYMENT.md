# LegalShield AI Deployment Guide

This guide covers the complete deployment process for LegalShield AI, from development to production.

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   External APIs │
│   (React/Vite)  │◄──►│   (Database)    │    │   (OpenAI, etc) │
│                 │    │   (Auth)        │    │                 │
│                 │    │   (Storage)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel/       │    │   Row Level     │    │   Stripe        │
│   Netlify       │    │   Security      │    │   Pinata IPFS   │
│   (Hosting)     │    │   (Policies)    │    │   (Payments)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Deployment (Vercel)

### 1. Prerequisites

- GitHub repository with your code
- Vercel account
- All required API keys (see Environment Variables section)

### 2. Deploy to Vercel

1. **Connect Repository**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Deploy from command line
   vercel
   ```

2. **Or use Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

### 3. Environment Variables in Vercel

Add these in your Vercel project settings:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=sk-your_openai_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_API_KEY=your_pinata_secret
VITE_APP_URL=https://your-domain.vercel.app
```

## 🗄 Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region (closest to your users)
4. Set strong database password

### 2. Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the entire `database/schema.sql` file
3. Click "Run" to execute

### 3. Create Storage Buckets

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('incident-reports', 'incident-reports', false),
  ('audio-recordings', 'audio-recordings', false);
```

### 4. Configure Storage Policies

```sql
-- Users can upload their own files
CREATE POLICY "Users can upload own incident reports" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'incident-reports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own incident reports" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'incident-reports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Similar policies for audio-recordings bucket
CREATE POLICY "Users can upload own audio recordings" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'audio-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own audio recordings" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'audio-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 5. Configure Authentication

1. Go to Authentication > Settings
2. Configure email templates
3. Set up OAuth providers (optional)
4. Configure redirect URLs for your domain

## 💳 Payment Setup (Stripe)

### 1. Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Complete account verification
3. Get API keys from Dashboard > Developers > API keys

### 2. Create Products and Prices

```bash
# Using Stripe CLI (optional)
stripe products create --name="LegalShield AI Premium" --description="Premium features for LegalShield AI"

stripe prices create \
  --unit-amount=499 \
  --currency=usd \
  --recurring-interval=month \
  --product=prod_your_product_id
```

### 3. Update Price IDs

Update `src/services/stripe.js` with your actual price IDs:

```javascript
export const subscriptionPlans = {
  premium: {
    name: 'Premium',
    price: 4.99,
    priceId: 'price_your_actual_price_id', // Update this
    features: [...]
  }
};
```

### 4. Configure Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe-webhook`
3. Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy webhook secret for your backend

## 🌐 IPFS Setup (Pinata)

### 1. Create Pinata Account

1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Get API keys from Account > API Keys
3. Create new key with admin permissions

### 2. Test Connection

```javascript
// Test in browser console after deployment
import { ipfsService } from './src/services/pinata.js';

ipfsService.testConnection().then(result => {
  console.log('Pinata connection:', result);
});
```

## 🤖 AI Setup (OpenAI)

### 1. Get OpenAI API Key

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Add payment method
3. Create API key
4. Set usage limits to control costs

### 2. Monitor Usage

- Check usage in OpenAI dashboard
- Set up billing alerts
- Consider implementing rate limiting

## 🔒 Security Configuration

### 1. Environment Variables

**Never commit these to version control:**

```env
# Production values
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (anon key, safe for client)
VITE_OPENAI_API_KEY=sk-... (should be server-side in production)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (publishable key, safe for client)
VITE_PINATA_API_KEY=your_key (should be server-side in production)
VITE_PINATA_SECRET_API_KEY=your_secret (should be server-side in production)
```

### 2. Supabase Security

1. **Row Level Security**: Already configured in schema
2. **API Keys**: Use anon key for client, service key for server
3. **CORS**: Configure allowed origins in Supabase settings

### 3. Content Security Policy

Add to your hosting platform:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com https://api.pinata.cloud;
```

## 📊 Monitoring & Analytics

### 1. Error Tracking

Add Sentry or similar:

```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### 2. Performance Monitoring

- Use Vercel Analytics
- Monitor Core Web Vitals
- Set up uptime monitoring

### 3. Database Monitoring

- Monitor Supabase dashboard
- Set up alerts for high usage
- Regular database backups

## 🚀 Alternative Deployment Options

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Configure redirects for SPA

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### AWS S3 + CloudFront

```bash
# Build and deploy to S3
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Production Optimizations

### 1. Performance

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react']
        }
      }
    }
  }
});
```

### 2. Caching

```javascript
// Add to your hosting platform
{
  "headers": [
    {
      "source": "/static/**",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. Compression

Most hosting platforms enable this automatically, but verify:
- Gzip/Brotli compression enabled
- Image optimization
- Minification

## 🧪 Testing in Production

### 1. Smoke Tests

```bash
# Test critical paths
curl -f https://your-domain.com/
curl -f https://your-domain.com/api/health
```

### 2. User Acceptance Testing

- Test authentication flow
- Test payment flow
- Test audio recording
- Test incident reporting
- Test on mobile devices

### 3. Load Testing

```bash
# Using Artillery
npm install -g artillery
artillery quick --count 10 --num 5 https://your-domain.com
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📋 Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema applied
- [ ] Storage buckets created
- [ ] Authentication working
- [ ] Payment flow tested
- [ ] Audio recording functional
- [ ] Location detection working
- [ ] Mobile responsiveness verified
- [ ] SSL certificate active
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Backup strategy in place

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check Supabase CORS settings
   - Verify domain in allowed origins

2. **Authentication Issues**
   - Check redirect URLs
   - Verify email templates
   - Test with different browsers

3. **Payment Failures**
   - Verify Stripe keys
   - Check webhook endpoints
   - Test with Stripe test cards

4. **Audio Recording Not Working**
   - Check HTTPS requirement
   - Verify microphone permissions
   - Test on different browsers

### Getting Help

- Check application logs
- Monitor Supabase logs
- Review Stripe dashboard
- Check browser console errors
- Test API endpoints individually

---

**Need help?** Open an issue on GitHub or check our documentation wiki.
