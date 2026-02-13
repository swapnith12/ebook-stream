

# 📚 Book Streaming App (ebooks.com-style)

## Overview
A book streaming web app inspired by ebooks.com where visitors can browse a catalog of books, and logged-in users can read EPUB books. Admins get a separate dashboard to manage (upload/delete) books. Starting with mock data and no backend.

---

## Page 1: Homepage / Book Catalog (Public)
- **Hero section** with a featured/trending book banner
- **Book grid** displaying cover images, titles, authors, and genres
- **Category filters** and a **search bar** to find books
- **Book cards** with hover effects showing brief descriptions
- Design inspired by ebooks.com: clean, bookstore-like layout with a top navigation bar

## Page 2: Book Detail Page
- Large cover image, full description, author info, genre tags, page count
- "Read Now" button (prompts login if not authenticated)
- Related/similar books section at the bottom

## Page 3: EPUB Reader
- Embedded EPUB reader for an immersive reading experience
- Chapter navigation (table of contents sidebar)
- Font size adjustment and basic reading settings
- Progress indicator
- *Note: Will use a client-side EPUB rendering library (e.g., epub.js)*

## Page 4: Login / Sign Up
- Simple email/password authentication form (mock auth for now — no backend)
- Option to continue as guest (browse only)
- Clean modal or dedicated page

## Page 5: Admin Dashboard (different layout)
- Accessible only to admin users
- **Sidebar navigation** with a distinct admin layout (different from the public site)
- **Book management table**: list all books with search/filter
- **Upload book form**: title, author, genre, description, cover image, EPUB file
- **Delete books** with confirmation dialog
- Dashboard stats (total books, categories, etc.)

---

## Navigation & Layout
- **Public layout**: Top navbar with logo, search, categories, login/signup button
- **Admin layout**: Sidebar-based dashboard layout with admin-specific navigation
- Responsive design for mobile and desktop

## Data (Mock)
- Hardcoded sample books with placeholder covers and metadata
- Mock admin credentials (e.g., admin@example.com)
- Sample EPUB files or placeholder content for the reader demo

## Future Enhancements (not in v1)
- Connect to Lovable Cloud for real backend (auth, database, file storage)
- User favorites/bookmarks and reading progress tracking
- Reviews and ratings
- User profile page

