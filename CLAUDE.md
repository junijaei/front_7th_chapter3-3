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

### FSD (Feature-Sliced Design) Architecture

이 프로젝트는 FSD 아키텍처를 학습하고 적용하기 위한 과제입니다. FSD는 Layer-Slice-Segment 3가지 차원으로 코드를 구조화합니다.

#### Layer-Slice-Segment 구조

**1. Layers (레이어)**: 수직적 계층 구조, 단방향 의존성 규칙
```
app → pages → widgets → features → entities → shared
```
- 상위 레이어는 하위 레이어만 참조 가능 (역방향 참조 금지)
- 각 레이어는 특정 책임과 추상화 수준을 가짐

**2. Slices (슬라이스)**: 비즈니스 도메인별 수평 분할
```
features/
  post/          ← slice (도메인/기능 단위)
  comment/       ← slice
  user/          ← slice
```
- 같은 레이어 내 다른 슬라이스 참조 금지 (낮은 결합도)
- 슬라이스 내부는 높은 응집도 유지

**3. Segments (세그먼트)**: 기술적 목적별 분류
```
features/post/
  ui/            ← segment (React 컴포넌트)
  api/           ← segment (API 호출)
  model/         ← segment (비즈니스 로직, 상태)
  lib/           ← segment (유틸리티)
  config/        ← segment (설정)
```

#### 각 레이어의 역할

| Layer | 구조 | 역할 | 예시 |
|-------|------|------|------|
| **app** | segment만 | 앱 전역 설정, 라우터, 프로바이더 | App.tsx, router.tsx, providers/ |
| **pages** | slice + segment | 페이지별/라우트별 조합 | pages/posts/, pages/post-detail/ |
| **widgets** | slice + segment | 재사용 가능한 복합 UI 블록 | widgets/post-table/, widgets/comment-list/ |
| **features** | slice + segment | 재사용 가능한 비즈니스 기능 (동사적) | features/post/create/, features/comment/like/ |
| **entities** | slice + segment | 도메인 데이터 모델 (명사적) | entities/post/, entities/comment/ |
| **shared** | segment만 | 비즈니스 로직 없는 공통 코드 | shared/ui/, shared/lib/, shared/api/ |

#### API 배치 기준 (카카오페이 사례 참고)

- **pages/[slice]/api**: 특정 페이지에서만 사용하는 API
- **features/[slice]/api**: 동일 도메인 내 여러 곳에서 재사용하는 기능성 API (비즈니스 로직 포함)
- **entities/[domain]/api**: 여러 도메인에서 사용하는 순수 데이터 CRUD API
- **shared/api**: 전역 공통 API 설정 (axios instance, interceptors 등)

**예시:**
```typescript
// entities/post/api/postApi.ts - 순수 CRUD
export const fetchPosts = () => fetch('/api/posts')
export const createPost = (data) => fetch('/api/posts', { method: 'POST', body: JSON.stringify(data) })

// features/post/create/api/createPostWithValidation.ts - 비즈니스 로직 포함
import { createPost } from '@/entities/post'
export const createPostWithValidation = async (data) => {
  if (data.title.length < 5) throw new Error('제목은 5자 이상')
  return createPost(data)
}

// features/post/delete/api/deletePostWithComments.ts - 여러 entity 조합
import { deletePost } from '@/entities/post'
import { deleteComments } from '@/entities/comment'
export const deletePostWithComments = async (postId) => {
  await deleteComments({ postId })
  await deletePost(postId)
}
```

#### Public API 규칙

각 슬라이스는 반드시 `index.ts`를 통해 공개 API를 명시적으로 export:
```typescript
// features/post/create/index.ts
export { CreatePostButton } from './ui/CreatePostButton'
export { createPostWithValidation } from './api/createPostWithValidation'
export { useCreatePost } from './model/useCreatePost'

// 다른 레이어에서 사용
import { CreatePostButton } from '@/features/post/create'  // ✅ OK
import { validateTitle } from '@/features/post/create/lib/validation'  // ❌ 내부 구현 직접 참조 금지
```

#### 이 프로젝트 적용 전략

**목표 구조:**
```
src/
  app/              # App.tsx, router, providers
  pages/            # 페이지별 조합 (posts/, post-detail/)
  widgets/          # 복합 UI (post-table/, comment-list/) - 선택적
  features/         # 비즈니스 기능
    post/
      create/       # 게시글 생성 (validation 포함)
      update/       # 게시글 수정
      delete/       # 게시글+댓글 삭제
    comment/
      like/         # 댓글 좋아요 (비즈니스 로직 포함)
      create/
      update/
  entities/         # 도메인 모델
    post/
      api/          # 순수 CRUD
      model/        # Post, CreatePostDto 타입
      ui/           # PostCard 같은 순수 표시 컴포넌트
    comment/
    user/
  shared/
    ui/             # Button, Dialog, Table (비즈니스 로직 없음)
    lib/            # highlightText 같은 유틸
    api/            # axios instance, API 공통 설정
```

**주요 원칙:**
1. **단방향 의존성**: 상위 → 하위만 참조 (features → entities, pages → features)
2. **슬라이스 독립성**: 같은 레이어 슬라이스 간 참조 금지 (features/post → features/comment ❌)
3. **Public API**: index.ts로만 export, 내부 구현 직접 참조 금지
4. **명확한 책임 분리**:
   - entities = 순수 CRUD + 데이터 타입 + 순수 UI
   - features = 비즈니스 로직 + 검증 + 여러 entity 조합
5. **Segment 목적성**: ui, api, model, lib는 "무엇"이 아닌 "목적"으로 구분

**리팩토링 시작점:**
- entities부터 시작 (Post, Comment, User 타입 및 CRUD API)
- 그 다음 features (비즈니스 로직이 있는 기능)
- 마지막으로 pages에서 조합

### Key Patterns to Follow
1. **Single Responsibility**: Break down large components into focused, single-purpose units
2. **Type Safety**: Define proper TypeScript types for all entities and API responses
3. **State Management**: Separate client state from server state (candidates: Context API, Jotai, Zustand, or TanStack Query)
4. **Separation of Concerns**: Isolate business logic, API calls, and UI rendering
5. **FSD Layer Rules**: Respect unidirectional dependencies (app → pages → features → entities → shared)

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
