# PVM - Player vs Map

A community-driven platform for Trackmania players to push their limits on technical maps. Track your progress, compete on leaderboards, and achieve time goals across curated map packs.

![PVM Banner](https://via.placeholder.com/1200x300?text=PVM+-+Player+vs+Map)

## 🎯 Features

- **Time Goals** - Multiple difficulty tiers for each track with point multipliers
- **Global Leaderboards** - Compete against players worldwide with rank progression
- **Tiered Maps** - Maps organized by difficulty with custom tier systems
- **Achievement Tracking** - Track your progress and accomplishments across all maps
- **Trackmania OAuth** - Secure authentication with your Trackmania account
- **Real-time Stats** - Live integration with Trackmania's official API
- **Customizable Ranks** - Detailed rank customization with visual effects

## 🚀 Technologies

### Backend
- **Go 1.23**
- **Gin**
- **GORM**
- **PostgreSQL 16**
- **JWT**

### Frontend
- **Next.js 14**
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **HeroUI**

### DevOps
- **Docker**
- **Docker Compose**
- **GitHub Actions**
- **Nginx**

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
cp .env.example .env
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
```

### 3. Run with Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
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
cp .env.example .env

# Run migrations (if applicable)
go run cmd/app/main.go migrate

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
cp .env.example .env.local

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

## 📁 Project Structure
```
pvm/
├── pvm-backend/                 # Go backend
│   ├── cmd/
│   │   └── app/
│   │       └── main.go         # Application entry point
│   ├── internal/
│   │   ├── controllers/        # HTTP handlers
│   │   ├── services/           # Business logic
│   │   ├── models/             # Database models
│   │   ├── middleware/         # Auth, CORS, etc.
│   │   └── database/           # Database connection
│   ├── go.mod
│   └── Dockerfile
│
├── pvm-frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # React components
│   │   ├── contexts/           # React contexts
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utility functions
│   ├── public/                 # Static assets
│   ├── package.json
│   └── Dockerfile
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
│
├── docker-compose.yml          # Docker orchestration
├── exampleenv                # Environment variables template
└── README.md
```

## 🚢 Deployment

### Automated Deployment with GitHub Actions

1. **Set up GitHub Secrets:**
   - `SERVER_HOST` - Your server IP or domain
   - `SERVER_USER` - SSH username
   - `SSH_PRIVATE_KEY` - SSH private key for deployment

2. **Push to main branch:**
```bash
   git push origin main
```

3. **GitHub Actions will automatically:**
   - Build Docker images
   - Push to GitHub Container Registry
   - Deploy to your server via SSH

### Manual Deployment
```bash
# On your server
cd /opt/pvm

# Create docker-compose.yml and .env
# (See deployment documentation)

# Pull and start
docker-compose pull
docker-compose up -d
```

## 🔧 Configuration

### Trackmania OAuth Setup

1. Go to https://api.trackmania.com/
2. Create an application
3. Set redirect URI to: `http://localhost:3000/auth/callback` (or your domain)
4. Copy Client ID and Secret to `.env`

### Nadeo API Credentials

1. Create account at https://api.trackmania.com/
2. Get API username and password
3. Add to `.env` file

### Database Migrations

The application automatically creates tables on first run. To manually access the database:
```bash
# Connect to database
docker exec -it pvm_db psql -U pvm_user -d pvm

# Or locally
psql -U pvm_user -d pvm
```

## 📚 API Documentation

### coming soon...

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Trackmania community for inspiration and support
- [Trackmania API](https://api.trackmania.com/) for official integrations
- All contributors and testers

## 📧 Contact

Shoot me a dm on discord: Laserr__

---

**Special thanks to Tommy & TechPVM people and the others making PVMs!**