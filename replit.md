# Overview

WP Disparador Evolution is a web application for managing bulk WhatsApp messaging through the Evolution API. The application provides a comprehensive interface for contact management, message templating, and viewing detailed messaging reports. It allows users to upload CSV files with contacts, compose messages, track sending status, and monitor delivery statistics through an intuitive dashboard.

**Latest Updates (September 2025):**
- Added "Clear Contacts" functionality in Dashboard with confirmation modal for removing all contacts from reports
- Implemented comprehensive Evolution API integration for WhatsApp instance management (create, connect, list, delete instances)
- Enhanced Settings page with Evolution API configuration and instance management capabilities

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application is built using React 19 with TypeScript, utilizing a component-based architecture. The main application state is managed at the top level with local component state for specific features. The UI follows a responsive design pattern using Tailwind CSS for styling, with dark mode support implemented through CSS classes and localStorage persistence.

**Key architectural decisions:**
- **Single Page Application (SPA)**: Uses React Router-like view switching without external routing library, keeping the bundle size minimal
- **Component Structure**: Organized into logical components (Dashboard, SendMessage, Settings, Sidebar) with shared components for common UI elements
- **Type Safety**: Full TypeScript implementation with custom types for Contact, ReportStats, and AppSettings
- **State Management**: Local state with React hooks, avoiding external state management libraries for simplicity

## Theme and Styling

The application implements a dual-theme system (light/dark) with automatic detection of user's system preference. Tailwind CSS provides utility-first styling with custom configurations for responsive design. The theme state is persisted in localStorage and applied through CSS classes on the document element.

## Mock Data Layer & Evolution API Integration

Currently implements a mock API service layer that simulates real API interactions with artificial delays to mimic network conditions. The mock services now include comprehensive Evolution API functionality for WhatsApp instance management.

**Data Models:**
- **Contact**: Represents individual message recipients with status tracking
- **ReportStats**: Aggregated statistics for dashboard display
- **AppSettings**: Configuration for API connection and default messages
- **EvolutionInstance**: WhatsApp instance with connection status, QR code data, and API keys
- **CreateInstanceRequest**: Request structure for creating new WhatsApp instances
- **EvolutionSettings**: Extended settings including global API key and instance management

**Evolution API Features:**
- Instance creation with QR code generation for WhatsApp connection
- Real-time connection status monitoring
- Instance management (list, connect, delete)
- Proper API key handling and authentication simulation
- QR code modal display for easy WhatsApp scanning

## File Upload and Processing

Implements client-side CSV file processing using the FileReader API. Contacts are parsed from CSV format (name,number) with validation and error handling. The system supports bulk operations with confirmation modals for user safety.

## Auto-refresh and Real-time Updates

Dashboard implements automatic data refresh every 5 seconds to provide near real-time status updates for ongoing message campaigns. Manual refresh capability is also provided for immediate updates.

# External Dependencies

## Frontend Dependencies

- **React 19**: Core UI library for component-based architecture
- **React DOM 19**: DOM rendering for React components
- **TypeScript**: Type safety and enhanced development experience

## Build and Development Tools

- **Vite**: Modern build tool and development server with hot module replacement
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **PostCSS**: CSS processing with autoprefixer for browser compatibility
- **Serve**: Static file server for production deployment

## Planned Integrations

- **Evolution API**: WhatsApp messaging service for actual message delivery
- **Gemini API**: AI integration for enhanced messaging capabilities (API key configuration present)

## Configuration

The application is configured to work in Replit environment with specific host and domain configurations. Environment variables are supported for API keys and external service configuration.