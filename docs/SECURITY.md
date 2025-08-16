# Security Guidelines

## Environment Variables and Secret Management

### ⚠️ Critical Security Rules

1. **Never commit actual secrets to version control**
   - Use placeholder values in `.env.example` files
   - Keep real secrets in `.env.local` (already gitignored)
   - Use environment variables in production

2. **Supabase Configuration**
   ```bash
   # ✅ Safe for .env.local.example
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # ❌ Never commit the actual key
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

### Local Development Setup

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Replace placeholder values with actual secrets in `.env.local`

3. The `.env.local` file is automatically ignored by git

### Production Deployment

For production environments, set environment variables through:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables  
- Docker: Use secrets or environment files
- Server: Export variables or use a secrets manager

### Secret Rotation

If a secret is accidentally exposed:
1. Immediately rotate the secret in the service (Supabase, etc.)
2. Update all environments with the new secret
3. Remove the old secret from git history if needed

### Additional Security Measures

- Use different keys for development, staging, and production
- Regularly audit and rotate secrets
- Consider using a dedicated secrets management service
- Enable secret scanning alerts in your repository settings

---

**Note**: This repository has been cleaned of any exposed secrets. The GitHub secret scanning alert has been resolved.
