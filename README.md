# NebulaStream - YouTube Clone Frontend

A modern, responsive YouTube clone built with React, TypeScript, and Vite. This frontend application provides a complete video streaming experience with user authentication, video management, and admin capabilities.

## 🚀 Features

### Core Features
- **Video Streaming**: Watch videos with a custom video player
- **User Authentication**: Google OAuth integration and traditional login/signup
- **Channel Management**: Create and manage multiple channels
- **Video Upload**: Upload and manage your own videos
- **Playlists**: Create and manage video playlists
- **Comments**: Comment system with moderation
- **Likes/Dislikes**: Video rating system
- **Subscriptions**: Subscribe to channels and manage subscriptions
- **Watch Later**: Save videos for later viewing
- **Download**: Download videos for offline viewing
- **Search**: Advanced video search functionality

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel
- **User Management**: Manage users and their permissions
- **Video Management**: Moderate and manage all videos
- **Channel Management**: Oversee all channels
- **Comment Moderation**: Review and moderate comments
- **Analytics**: View platform statistics and insights
- **Settings**: Configure platform settings

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Theme switching capability
- **Mini Player**: Picture-in-picture video player
- **Skeleton Loading**: Smooth loading states
- **Real-time Notifications**: Live notification system

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 7.9.6
- **Styling**: Tailwind CSS with custom components
- **HTTP Client**: Axios 1.13.2
- **Authentication**: Google OAuth 2.0
- **Icons**: Lucide React
- **Charts**: Recharts for analytics
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RehanTariq536924555/Youtube_clone_frontend.git
   cd Youtube_clone_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   VITE_API_BASE_URL=your_backend_api_url
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
nebulastream/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   ├── Navbar.tsx       # Navigation component
│   ├── Sidebar.tsx      # Sidebar navigation
│   ├── VideoPlayer.tsx  # Custom video player
│   └── ...
├── views/               # Page components
│   ├── admin/           # Admin panel pages
│   ├── auth/            # Authentication pages
│   ├── Home.tsx         # Home page
│   ├── VideoPlayer.tsx  # Video player page
│   └── ...
├── services/            # API service functions
│   ├── authService.ts   # Authentication API
│   ├── videoService.ts  # Video management API
│   └── ...
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── config/              # Configuration files
└── ...
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# App Configuration
VITE_APP_NAME=NebulaStream
VITE_APP_VERSION=1.0.0
```

### Backend Integration

This frontend is designed to work with the corresponding backend API. Make sure to:

1. Set up the backend server
2. Configure CORS settings
3. Update API endpoints in services
4. Set up Google OAuth credentials

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables on your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Some features may require backend API to be running
- Google OAuth requires proper domain configuration
- Video upload size limits depend on backend configuration

## 🔮 Future Enhancements

- [ ] Live streaming support
- [ ] Advanced video editing tools
- [ ] Mobile app development
- [ ] Enhanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced recommendation system

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [Your Email]

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast build tool
- All contributors and testers

---

**Note**: This is a YouTube clone for educational purposes. Please respect YouTube's terms of service and intellectual property rights.