# Project Setup

## Environment Variables

This project uses environment variables for configuration. You need to set up a `.env.local` file in the root directory.

### 1. Create `.env.local`

Copy the example file to create your local configuration:

```bash
cp .env.example .env.local
```

### 2. Configure Variables

Open `.env.local` and set the following variables:

- `MONGODB_URI`: Your MongoDB connection string.
  - Format: `mongodb://username:password@host:port/database?authSource=admin`
  - Example: `mongodb://admin:password@localhost:27017/myDb?authSource=admin`

- `JWT_SECRET`: A secret key for signing JSON Web Tokens.
  - You can generate a strong secret using: `openssl rand -base64 32`
  - Or use any long, random string.

### 3. Run the Application

```bash
npm run dev
```

## Troubleshooting

If you see errors like "Please define the MONGODB_URI environment variable", ensure you have created `.env.local` and populated it correctly.
