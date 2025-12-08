# CLAUDE.md

ALWAYS RESPOND IN KOREAN
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based admin panel for managing posts and comments, built as a learning project for Feature-Sliced Design (FSD) architecture refactoring. The codebase is currently in a pre-refactored state with a large monolithic component that needs to be broken down using proper architectural patterns.

**Korean Project Context (Chapter 3-3):**
- This is a homework assignment focused on refactoring legacy code to apply FSD architecture
- The current codebase intentionally contains anti-patterns to be refactored
- Goals include: proper TypeScript usage, component separation, state management implementation, and FSD folder structure

## Development Commands

```bash
# Development server (runs on http://localhost:5173)
pnpm dev

# Build the project
pnpm build

# Run linter
pnpm lint

# Run tests with Vitest
pnpm test

# Run tests with coverage
pnpm coverage

# Preview production build
pnpm preview
```

## Architecture & Code Structure

### Current State (Pre-Refactoring)
The codebase currently has minimal structure:
- **src/pages/PostsManagerPage.tsx**: Single 720+ line component containing all logic (posts, comments, users, dialogs)
- **src/components/**: Shared UI components (Header, Footer, Comments) and reusable primitives (Button, Dialog, Table, etc.)
- **src/types/**: Minimal TypeScript types (only comment.types.ts exists)
- **src/utils/**: Utility functions (currently only highlightText)

### Expected Refactoring Direction (FSD/Feature-based)
The project is meant to evolve toward:
- **entities/**: Domain models and types (Post, Comment, User) with associated UI and API
- **features/**: User actions and event handlers (add-post, edit-comment, like-post, etc.)
- **widgets/**: Reusable composite components (PostTable, CommentList, UserModal)
- **shared/**: Common UI components and utilities

### Key Patterns to Follow
1. **Single Responsibility**: Break down large components into focused, single-purpose units
2. **Type Safety**: Define proper TypeScript types for all entities and API responses
3. **State Management**: Separate client state from server state (candidates: Context API, Jotai, Zustand, or TanStack Query)
4. **Separation of Concerns**: Isolate business logic, API calls, and UI rendering

## API Integration

The app uses a proxy to communicate with DummyJSON API:

```javascript
// Configured in vite.config.ts
'/api' → 'https://dummyjson.com'
```

### API Endpoints Used
- `GET /api/posts?limit={limit}&skip={skip}` - Fetch posts with pagination
- `GET /api/posts/search?q={query}` - Search posts
- `GET /api/posts/tag/{tag}` - Filter posts by tag
- `GET /api/posts/tags` - Get all available tags
- `POST /api/posts/add` - Create new post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `GET /api/comments/post/{postId}` - Fetch comments for a post
- `POST /api/comments/add` - Add comment
- `PUT /api/comments/{id}` - Update comment
- `PATCH /api/comments/{id}` - Like comment
- `DELETE /api/comments/{id}` - Delete comment
- `GET /api/users?limit=0&select=username,image` - Fetch users
- `GET /api/users/{id}` - Get user details

## Technology Stack

- **Framework**: React 19.2.1 with React Router DOM for routing
- **Build Tool**: Vite 7.2.6
- **TypeScript**: ~5.9.3
- **Testing**: Vitest 4.0.15 with jsdom, @testing-library/react, MSW for mocking
- **UI Components**: Radix UI (@radix-ui/react-dialog, @radix-ui/react-select), Lucide React icons
- **Styling**: TailwindCSS (via class-variance-authority for variant management)
- **HTTP Client**: axios (configured but not currently used; fetch API is used instead)

## Important Implementation Notes

### Current Issues to Address During Refactoring
1. **Too Many States**: PostsManagerPage has 15+ useState hooks managing unrelated concerns
2. **Complex useEffect Logic**: Multiple useEffects with interdependencies (lines 308-329)
3. **Mixed Async Patterns**: Combination of .then() chains and async/await
4. **Prop Drilling**: Comments component receives 8+ props passed down through multiple levels
5. **URL State Management**: Manual URLSearchParams handling needs improvement

### Code Quality Considerations
- All UI components in `src/components/index.tsx` are built with Radix UI primitives
- The `highlightText` utility in `src/utils/index.tsx` is used for search result highlighting
- TypeScript types are incomplete - only Comment interface exists currently
- No error boundary implementation currently exists
- Loading states are basic (text-only)

## Future Enhancements (Per Assignment)
- **Basic Task**: Implement global state management and apply FSD folder structure
- **Advanced Task**: Integrate TanStack Query for server state management with optimistic updates
- **Final Task**: Create custom feature-based folder structure (evolution of FSD)
