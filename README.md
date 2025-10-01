# 🚀 Phaze17 Admin Dashboard

A modern, professional admin dashboard built with React, Vite, and Tailwind CSS, featuring comprehensive user management, analytics, and administrative capabilities.

## ✨ Features

- **🔐 Authentication & Authorization** - Secure login with role-based access control
- **👥 User Management** - Complete CRUD operations for user accounts
- **📊 Analytics Dashboard** - Real-time charts and metrics
- **🎨 Modern UI** - Built with Radix UI and Tailwind CSS
- **📱 Responsive Design** - Works seamlessly on all devices
- **🌙 Dark/Light Mode** - Theme switching support
- **⚡ Fast Performance** - Optimized with Vite and modern React
- **🔍 Advanced Search** - Filter and search across all data
- **📈 Data Visualization** - Interactive charts with Recharts
- **🛡️ Security First** - Built with security best practices

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Build Tool:** Vite
- **UI Components:** Radix UI, Lucide React Icons
- **Forms:** React Hook Form with Zod validation
- **Routing:** React Router DOM
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Package Manager:** pnpm

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- pnpm 10+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Phaze17/admin-dashboard.git
   cd admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Build the project
pnpm build

# Preview the build locally
pnpm preview
```

## 📁 Project Structure

```
admin-dashboard/
├── public/                 # Static assets
│   ├── css/               # Tabler CSS files
│   ├── js/                # JavaScript libraries
│   └── img/               # Images and icons
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── assets/           # Images, fonts, etc.
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── .github/              # GitHub workflows and templates
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## 🧪 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Code Style

This project uses ESLint for code linting. Please ensure your code passes linting before submitting PRs.

### Git Workflow

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests and linting
4. Submit a pull request to `develop`
5. After review, changes are merged to `main` for production

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=https://your-api-url.com
VITE_APP_TITLE=Phaze17 Admin Dashboard
```

### Customization

- **Themes:** Modify `src/lib/themes.js` for custom color schemes
- **Components:** Add new components in `src/components/`
- **Routing:** Update routes in `src/App.jsx`

## 📊 Features Overview

### Dashboard Analytics
- Real-time metrics display
- Interactive charts and graphs
- Customizable widgets
- Export capabilities

### User Management
- User registration and profiles
- Role and permission management
- Bulk operations
- Activity logging

### Data Management
- CRUD operations for all entities
- Advanced filtering and search
- Data import/export
- Audit trails

## 🛡️ Security

- Input validation with Zod schemas
- XSS protection
- CSRF protection
- Secure authentication flow
- Role-based access control

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](.github/CONTRIBUTING.md) for detailed information.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@phaze17.com
- 🐛 Issues: [GitHub Issues](https://github.com/Phaze17/admin-dashboard/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Phaze17/admin-dashboard/discussions)

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic dashboard layout
- [x] User authentication
- [x] Core UI components
- [ ] User management system
- [ ] Analytics integration

### Phase 2 (Planned)
- [ ] Advanced reporting
- [ ] API integrations
- [ ] Mobile app
- [ ] Multi-tenant support

### Phase 3 (Future)
- [ ] AI-powered insights
- [ ] Advanced automation
- [ ] Third-party integrations
- [ ] Enterprise features

---

**Made with ❤️ by the Phaze17 Team**