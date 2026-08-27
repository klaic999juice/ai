# Vercel serverless configuration for FastAPI

The application is deployed on Vercel with Python support.

## Deployment Steps:

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

## Environment Variables Required:

- `OPENAI_API_KEY` - Your OpenAI API key
- `DATABASE_URL` - PostgreSQL connection string (recommended for production)
- `DEBUG` - Set to `false`

## Access After Deployment:

- Main app: `https://your-project.vercel.app/`
- API docs: `https://your-project.vercel.app/docs`
