\# BAPTISTRY - Project Summary



\## Overview

\*\*BAPTISTRY\*\* is a free, online KJV Bible study tool built with Next.js, Clerk authentication, and Convex database. It provides Scripture lookup, dictionary, reference library, chat with AI, and daily devotions.



\---



\## Live URLs

\- \*\*Main Site:\*\* https://www.baptistry.app

\- \*\*Vercel Deployment:\*\* https://baptistry-live.vercel.app

\- \*\*Admin Dashboard:\*\* https://www.baptistry.app/admin/users



\---



\## Tech Stack



| Technology | Purpose |

|------------|---------|

| \*\*Next.js 14\*\* | Frontend framework |

| \*\*Tailwind CSS\*\* | Styling |

| \*\*Clerk\*\* | Authentication (Google sign-in) |

| \*\*Convex\*\* | Cloud database (chat sync) |

| \*\*Vercel\*\* | Hosting |

| \*\*Dify API\*\* | AI responses |



\---



\## Features Implemented



\### ✅ Core Features

\- \*\*Chat Interface\*\* — Ask anything about Scripture, doctrines, preachings, devotions

\- \*\*Message Actions\*\* — Edit, Copy, Regenerate, Stop

\- \*\*Thumbs Up/Down\*\* — Feedback on responses (yellow ring when selected)

\- \*\*Dark/Light Mode\*\* — Persistent theme preference

\- \*\*Guest Banner\*\* — "Sign in to save your chat history" (shown to guests)



\### ✅ Sidebar (Left)

\- \*\*New Chat\*\* button

\- \*\*Chat History\*\* — Search, rename, delete, pin conversations

\- \*\*Daily Bible Promise\*\* — Verse of the day

\- \*\*Navigation\*\* — Bible, About, My Books, Daily Devotion, Support



\### ✅ Right Sidebar Tools

\- \*\*📖 KJV Bible Lookup\*\* — Search any verse

\- \*\*📚 Webster's 1828 Dictionary\*\* — Historic definitions

\- \*\*📚 Baptist Reference Library\*\* — Links to resources



\### ✅ About Modal

\- Professional design with wallpaper

\- FOMO-driven content

\- "How It Started", "What Is BAPTISTRY", "Purpose", "Key Features"

\- Email contact with popup form

\- Facebook link: https://www.facebook.com/BeginWithGod

\- Church: https://www.bordergatebaptist.net



\### ✅ Books Showroom

\- Anchored Series (6 books)

\- Ignited Series (6 books)

\- Standalone Books (3 books)

\- Amazon links for each book

\- Email contact for inquiries



\### ✅ Daily Devotion

\- Rotates automatically based on day of year

\- 15+ devotions with:

&#x20; - Title, Tagline (with ✍️ emoji)

&#x20; - Scripture verse

&#x20; - Rich content

&#x20; - Prayer

&#x20; - Image (/devotions/Devotion-1.jpg to Devotion-15.jpg)

&#x20; - Facebook link

\- Button in sidebar after "My Books"



\### ✅ PWA (Progressive Web App)

\- Installable on mobile devices

\- Manifest and Service Worker

\- "📲 Install" button for guests only

\- QR code + direct download in user menu



\### ✅ Admin Features

\- `/admin` — Add update notifications

\- `/admin/users` — View registered users

\- Maintenance mode (via environment variable)



\---



\## Key Files \& Their Purpose



| File | Purpose |

|------|---------|

| `app/MainContent.tsx` | Main chat interface |

| `app/components/MessageBubble.tsx` | Individual message display |

| `app/components/Sidebar.tsx` | Left sidebar navigation |

| `app/components/RightSidebar.tsx` | Bible/Dictionary/Reference tools |

| `app/components/UserMenu.tsx` | User dropdown (profile, install, help, feedback, logout) |

| `app/components/Header.tsx` | Top header with menu, messages, notifications, dark mode toggle |

| `app/components/AboutModal.tsx` | About BAPTISTRY modal |

| `app/components/BooksModal.tsx` | Book showroom |

| `app/components/DevotionModal.tsx` | Daily Devotion display |

| `app/components/BookDetailModal.tsx` | Book detail with Amazon link |

| `app/data/devotions.ts` | All devotion content |

| `app/api/chat/route.js` | Dify AI integration (streaming mode) |

| `app/api/dictionary/route.ts` | Webster's 1828 Dictionary |

| `app/layout.tsx` | Root layout with Convex, Clerk, Theme providers |



\---



\## Current State



\### ✅ Working

\- Chat with full features

\- Bible Lookup

\- Webster's 1828 Dictionary

\- Books Showroom

\- Daily Devotion (15 devotions)

\- PWA Install

\- Dark/Light Mode

\- Admin user analytics

\- Guest sign-in banner

\- All book Amazon links



\### ⚠️ Not Fully Implemented

\- Cross-browser chat sync (Convex — in progress)

\- Scripture hyperlinks (removed due to issues)



\### ⚠️ Known Issues

\- Chat history does not sync across browsers yet (Convex needs fixing)

\- Some dictionary words may not be found (limited to API)



\---



\## Environment Variables



| Variable | Purpose |

|----------|---------|

| `NEXT\_PUBLIC\_CONVEX\_URL` | Convex database URL |

| `NEXT\_PUBLIC\_APP\_KEY` | Dify API key |

| `CLERK\_SECRET\_KEY` | Clerk authentication |

| `MAINTENANCE\_MODE` | Toggle maintenance mode (true/false) |



\---



\## Admin Access

\- \*\*Only accessible to:\*\* `always.begin.with.god@gmail.com`

\- \*\*Admin pages:\*\* `/admin`, `/admin/users`

\- \*\*Clerk Dashboard:\*\* https://dashboard.clerk.com



\---



\## Last Updated

\*\*July 5, 2025\*\*



\---



\## Quick Start for New Session



To continue working on BAPTISTRY:



1\. \*\*Open project:\*\*

cd C:\\Users\\dhens\\baptistry-ui

code.



2\. \*\*Start dev server:\*\*



3\. \*\*Deploy to Vercel:\*\*

git add .

git commit -m "your message"

git push origin main





4\. \*\*Key files to edit:\*\*

\- Add devotions: `app/data/devotions.ts`

\- Update books: `app/components/BooksModal.tsx`

\- Modify chat: `app/MainContent.tsx`



\---



\## Next Priorities (When Ready)

1\. Fix cross-browser chat sync (Convex date issue)

2\. Speed optimization (Dify streaming)

3\. Add more devotions

