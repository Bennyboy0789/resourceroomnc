# Resource Room NC — Website Rebuild Brief

## Project Overview
Rebuild **resourceroomnc.com** as a modern Next.js site, using the design language of **pathways.resourceroom.com** as the style reference.

## Style Reference: pathways.resourceroom.com
The Pathways site uses:
- **Clean, bold typography** — large headings with emphasized words
- **Minimal color palette** — deep navy/charcoal backgrounds with white text, accent teal/green
- **Section dividers** — clear visual separation between content zones
- **Card-based layouts** — rounded corners, subtle shadows, icon + heading + description
- **Hero section** — bold headline, subtitle, two CTAs (primary filled, secondary outlined)
- **Navigation** — sticky header, clean links, CTA button right-aligned
- **Testimonial cards** — clean, minimal
- **Numbered steps** — "1, 2, 3" visual journey
- **No carousels** — everything is static, scrollable
- **Footer** — multi-column with program links, contact info, social

## Current Site Content (resourceroomnc.com)

### Navigation
- About (dropdown: About Us, Mission)
- All Programs (dropdown: Tutoring, Camps, SAT/ACT Prep, Pathways Academy, Homeschool Co-Op, ABA Services, College Prep, IEP & 504 Advocate)
- IEP & 504 Advocate
- Contact Us
- Join Our Team
- Blog

### Hero Section
**Headline:** "A Complete Learning Center for Every Student."
**Subtext:** "From early reading to AP Calculus, summer camps to a private high school, every Resource Room program is built around one student at the center: yours."
**Awards:** ★★★★★ 100+ FIVE-STAR REVIEWS | HOLLY SPRINGS BUSINESS OF THE YEAR 2022 | Raleigh's Best 2025 Bronze Winner in Education
**CTAs:** Schedule a Free Consultation | 📞 984-777-1244

### Program Quick Links (below hero)
- Tutoring Programs
- Track-Out & Summer Camps
- SAT / ACT Prep
- Pathways Academy

### Popular Programs (e-commerce products — REMOVE pricing/cart)
1. **ABA Support in an Educational Setting** — Structured Daytime Learning
2. **Homeschool Co-Op in Holly Springs, NC** — Structured Daytime Learning
3. **Executive Functioning Coaching and Support** — Tutoring Programs
4. **STEM Themed Summer Camps** — STEAM Programs
5. **SAT Test Prep in Holly Springs, NC** — Test Prep Programs
6. **Summer Bridge Tutoring Programs** — Tutoring Programs

### Why Choose Resource Room
- **Individualized** — A targeted approach for each student
- **Engaging** — Curriculum based STEAM Programs
- **Professional** — Owned and Operated by licensed educators

### About / Founders
**Heading:** "Owned and operated by licensed career educators."
Joe and Sam, husband and wife, each have over a decade of classroom experience, are duly licensed, and hold multiple graduate degrees.

**Quote:** "As career educators, we built Resource Room with one goal in mind: to provide a top-tier educational experience for students of all ages and to create high-quality, personalized programs that help students and families reach their goals." — Joe & Sam, Resource Room Founders

### Stats
- ★★★★★ 5 Star Rating
- 15+ Years of Professional Experience  
- 95% Client Retention

### About Resource Room
With a wide offering of educational programs and support, Resource Room aims to provide services for learners of all ages.
- Curriculum Based Instructions — Our STEAM Programs are curriculum based and standards aligned
- Tutoring for All Subjects — Tutoring programs tailored to the individual needs of each student
- College Advisement and Essays — Professional support through the entire application process

### Programs Section
1. **Tutoring Programs** — Private one-to-one instruction for all grade levels: K-12, including AP Math and Science
2. **CAMPS: Trackout, Summer, and Teacher-Workday** — Fun, Engaging, STEAM activities and programs
3. **College Prep** — Professional SAT/ACT Tutoring, College Admissions support, Essay Writing and Common App
4. **Pathways Academy** — A Private High School for Neurodiverse Learners with Autism

### Testimonials
- **Jenny H** (Parent): "The Resource Room has been such a help to our family! From elementary to high school they know their stuff. So glad we found them!"
- **Megan R** (Student): "Amazing staff and environment! They helped me tremendously to do well in my courses and with the SAT..."
- **Karen C** (Parent): "Resource Room has been a tremendous help to my 4th grade daughter... her grades went up significantly..."
- **Victoria V** (Parent): [uses services for multiple children]

### Contact/Location
- 📞 984-777-1244
- Learn@ResourceRoomNC.com
- 2100 Crossway Ln, Holly Springs, NC

### Additional Pages Needed
- **About** — Mission, team, facility info
- **All Programs** — Overview page linking to individual program pages
- **Individual Program Pages** — One per program (Tutoring, Camps, SAT/ACT, Pathways, Homeschool Co-Op, ABA, College Prep, IEP/504)
- **Contact** — Form, map, contact info
- **Blog** — Link to existing WordPress blog or new blog section
- **Join Our Team** — Careers page

## Design Requirements

### Color Palette (from Pathways + logo)
- **Primary Navy/Charcoal:** `#1a1f2e` or similar deep navy
- **Accent Gold:** from logo gold (#c4a44a or similar)
- **Accent Blue:** from logo blue
- **White:** clean sections
- **Light Gray:** `#f5f5f5` for alternating sections

### Typography
- Clean sans-serif (Inter or system fonts)
- Large hero heading (48-64px)
- Section headings: 32-40px 
- Body: 16-18px
- Emphasized words in headings use accent color

### Layout Pattern (from Pathways)
1. **Top bar:** "A Resource Room Learning Center" + phone
2. **Nav:** Logo left, links center/right, CTA button right
3. **Hero:** Full-width, text left, awards badges, 2 CTAs
4. **Program links:** Horizontal pill/card row
5. **Popular programs:** Card grid (3-4 across)
6. **Why choose us:** 3-column icon cards
7. **Founders:** Two-column (text + image)
8. **Stats bar:** Horizontal stat cards
9. **Program cards:** 2x2 grid with images
10. **Testimonials:** Horizontal scroll cards
11. **CTA section:** Bold final call to action
12. **Footer:** Multi-column

### What to REMOVE
- ❌ Shopping cart / e-commerce / pricing
- ❌ Search bar from header
- ❌ Carousel sliders (replace with static hero)
- ❌ WooCommerce product listings
- ❌ "Original price was / Current price is" markup
- ❌ Video embeds (can add back later)

### What to KEEP/IMPROVE
- ✅ All award badges
- ✅ Five-star review count
- ✅ "Business of the Year" mention
- ✅ All program descriptions
- ✅ Founders quote and bio
- ✅ All testimonials
- ✅ Contact info
- ✅ "Schedule a Free Consultation" as primary CTA

## Technical Requirements
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- Static generation where possible
- Responsive (mobile-first)
- Fast: aim for 90+ Lighthouse
- All content in content files (easy to edit)

## Pages to Build
1. `/` — Home page (most important)
2. `/about` — About page
3. `/programs` — All programs overview
4. `/programs/tutoring` — Tutoring detail
5. `/programs/camps` — Camps detail
6. `/programs/sat-act-prep` — Test prep detail
7. `/programs/pathways-academy` — Link to pathways.resourceroom.com
8. `/programs/homeschool-co-op` — Homeschool co-op detail
9. `/programs/aba-services` — ABA detail
10. `/programs/college-prep` — College prep detail
11. `/programs/iep-504-advocate` — IEP/504 detail
12. `/contact` — Contact page
13. `/join-our-team` — Careers page

## Assets Needed
- Logo (Resource Room logo — grab from current site)
- Founders photo
- Program/classroom photos
- Award badges (Raleigh's Best, Business of the Year)
- Icons for program cards
