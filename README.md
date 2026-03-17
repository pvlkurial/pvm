# PVM - Player vs Map

A community-driven platform for Trackmania players to push their limits on technical maps. Track your progress, compete on leaderboards, and achieve time goals across curated map packs.

All app updates are available on [Patreon](https://www.patreon.com/cw/PVMWebsite).

# https://pvms.club

## 🎯 Features

- **Time Goals** - Multiple difficulty tiers (medals) for each track with point multipliers
- **Global Leaderboards** - Compete against players worldwide with rank progression
- **Tiered Maps** - Maps organized by difficulty with custom tier systems
- **Achievement Tracking** - Track your progress and accomplishments across all maps
- **Trackmania OAuth** - Secure authentication with your Trackmania account
- **Automatic Stats** - Live integration with Trackmania's official API (Updates every 12 hours)
- **Customizable Ranks** - Ranks based on points gained in each mappack

## 🚀 Technologies

### Backend
- **Golang**
- **Gin**
- **GORM**
- **PostgreSQL**
- **JWT**

### Frontend
- **Next.js**
- **React**
- **TypeScript**
- **Tailwind**
- **HeroUI**

### DevOps
- **Docker**
- **GitHub Actions**
- **Nginx**
- **Grafana**
- **Prometheus**

## 📋 Prerequisites

- **Docker** & **Docker Compose**
- **Node.js 20+** (for local development)
- **Go 1.23+** (for local development)
- **PostgreSQL 16** (for local development without Docker)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/pvm.git
cd pvm
```

### 2. Set Up Environment Variables

Create `.env` file in the root directory:
```bash
cp envexample .env
```

Edit `.env` with your credentials:
```env
# Database
DB_NAME=pvm
DB_USER=pvm_user
DB_PASSWORD=your_secure_password
CONNECTION_STRING=postgresql://pvm_user:your_secure_password@db:5432/pvm?sslmode=disable

# Trackmania OAuth (get from https://api.trackmania.com/)
TRACKMANIA_CLIENT_ID=your_client_id
TRACKMANIA_CLIENT_SECRET=your_client_secret
TRACKMANIA_REDIRECT_URI=http://localhost:3000/auth/callback

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here

# Nadeo API (get from https://api.trackmania.com/)
NADEO_API_USERNAME=your_nadeo_username
NADEO_API_PASSWORD=your_nadeo_password
USER_AGENT=PVM / your@email.com

# Frontend
NEXT_PUBLIC_API_URL=/api

# Grafana
GRAFANA_PASSWORD=your_grafana_password

# Webhook
WEBHOOK_URL=webhook_for_discord
```

### 3. Run with Docker (Recommended)
```bash
# Start all services
docker-compose up -d
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database: localhost:5432

## 💻 Local Development

### Backend
```bash
cd pvm-backend

# Install dependencies
go mod download

# Create .env file
cp envexample .env

# Start server
go run cmd/app/main.go

# Server will start on http://localhost:8080
```

### Frontend
```bash
cd pvm-frontend

# Install dependencies
npm install

# Create .env.local file
cp envexample .env

# Start development server
npm run dev

# Application will start on http://localhost:3000
```

### Database
```bash
# Using Docker
docker run -d \
  --name pvm_db \
  -e POSTGRES_DB=pvm \
  -e POSTGRES_USER=pvm_user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:16-alpine

# Or install PostgreSQL locally and create database
createdb pvm
```

## 🔧 Configuration

### Trackmania OAuth Setup

1. Go to https://api.trackmania.com/
2. Create an application
3. Set redirect URI to: `http://localhost:3000/auth/callback` (or your domain)
4. Copy Client ID and Secret to `.env`

### Nadeo API Credentials

1. Using a dedicated server account

## 📚 API Documentation / Logging

  Logging is done using slog, json on production
  Logs are displayed in grafana on prod
  
  API Docs coming soon. For the time being, see routes.go in pvm-backend.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to DEV!!!

If you wish to contribute to the project financially,
you may through [Patreon](https://www.patreon.com/cw/PVMWebsite/membership).


## 🙏 Acknowledgments

- Trackmania community for making PVMs!
- All contributors and feedback givers

## 📧 Contact

Shoot me a dm on discord: Laserr__

---
