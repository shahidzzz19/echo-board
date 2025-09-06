# Personalized Content Dashboard

A modern, responsive dashboard for consuming personalized content from multiple sources including news, recommendations, and social media posts.

## 🚀 Features

### Core Functionality

- **Personalized Content Feed**: Customizable content based on user preferences
- **Multi-Source Integration**: News, recommendations, and social media content
- **Advanced Search**: Debounced search with filtering capabilities
- **Infinite Scrolling**: Efficient content loading with pagination
- **Drag & Drop**: Reorder content cards with smooth animations
- **Favorites System**: Save and organize favorite content items

### User Experience

- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### Technical Features

- **State Management**: Redux Toolkit with RTK Query for API calls
- **Persistence**: User preferences saved to localStorage
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive unit, integration, and E2E tests
- **Performance**: Optimized rendering and data fetching

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Redux Toolkit + RTK Query
- **Animations**: Framer Motion
- **Drag & Drop**: React DnD
- **Testing**: Jest, React Testing Library, Playwright
- **Theme**: next-themes for dark/light mode

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/personalized-content-dashboard.git
   cd personalized-content-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests

\`\`\`bash
npm run test
\`\`\`

### Watch Mode

\`\`\`bash
npm run test:watch
\`\`\`

### Coverage Report

\`\`\`bash
npm run test:coverage
\`\`\`

### E2E Tests

\`\`\`bash
npm run e2e
\`\`\`

### E2E Tests with UI

\`\`\`bash
npm run e2e:ui
\`\`\`

## 🏗️ Project Structure

\`\`\`
├── app/ # Next.js App Router
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ ├── providers.tsx # Redux and theme providers
│ └── globals.css # Global styles
├── components/ # React components
│ ├── ui/ # shadcn/ui components
│ ├── dashboard.tsx # Main dashboard component
│ ├── sidebar.tsx # Navigation sidebar
│ ├── header.tsx # Top header with search
│ ├── content-feed.tsx # Main content feed
│ └── ... # Other components
├── lib/ # Utilities and configuration
│ ├── store.ts # Redux store configuration
│ ├── slices/ # Redux slices
│ ├── api/ # RTK Query API definitions
│ └── hooks/ # Custom React hooks
├── **tests**/ # Unit and integration tests
├── e2e/ # End-to-end tests
└── public/ # Static assets
\`\`\`

## 🎯 Key Features Explained

### 1. Personalized Content Feed

- Users can select preferred categories (technology, sports, finance, etc.)
- Content is fetched from multiple mock APIs
- Real-time filtering based on user preferences
- Infinite scrolling for seamless browsing

### 2. Search Functionality

- Debounced search input (300ms delay)
- Search across all content types
- Real-time results with loading states
- Empty state handling

### 3. Drag & Drop Reordering

- Drag content cards to reorder them
- Visual feedback during drag operations
- Smooth animations and transitions
- Touch support for mobile devices

### 4. State Management

- Redux Toolkit for global state
- RTK Query for efficient API calls
- Redux Persist for user preferences
- Optimistic updates for better UX

### 5. Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🔧 Configuration

### User Preferences

Users can customize:

- Content categories
- Layout preference (grid/list)
- Theme (dark/light/system)
- Language settings

### API Integration

The app uses mock APIs that simulate:

- News API responses
- Recommendation engine data
- Social media posts
- Real-time trending content

## 🚀 Deployment

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Start Production Server

\`\`\`bash
npm start
\`\`\`

### Deploy to Vercel

\`\`\`bash
npx vercel
\`\`\`

## 📊 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **Lazy Loading**: Components and routes
- **Memoization**: React.memo and useMemo usage

## 🧪 Testing Strategy

### Unit Tests

- Component rendering and behavior
- Redux slice logic
- Custom hooks functionality
- Utility functions

### Integration Tests

- Component interactions
- API integration
- State management flow
- User workflows

### E2E Tests

- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Performance testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

For questions or support, please open an issue on GitHub or contact [your-email@example.com](mailto:your-email@example.com).
