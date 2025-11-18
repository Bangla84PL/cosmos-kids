# SmartCamp.AI Brand Guidelines

## Brand Overview

SmartCamp.AI is an innovative educational technology platform that empowers learners through AI-powered, engaging, and personalized learning experiences. Our brand reflects creativity, intelligence, playfulness, and trustworthiness.

## Brand Values
- **Innovative**: Cutting-edge AI technology for education
- **Playful**: Learning should be fun and engaging
- **Trustworthy**: Safe, reliable, and transparent
- **Empowering**: Give learners tools to succeed
- **Inclusive**: Education for everyone

## Color Palette

### Primary Colors

**Jungle Green** - Primary brand color
- Hex: `#1a4d2e`
- RGB: `rgb(26, 77, 46)`
- Usage: Primary buttons, headers, key CTAs

**Forest Green** - Secondary
- Hex: `#2d6a4f`
- RGB: `rgb(45, 106, 79)`
- Usage: Secondary buttons, accents

**Mint Green** - Accent
- Hex: `#52b788`
- RGB: `rgb(82, 183, 136)`
- Usage: Highlights, success states, interactive elements

**Light Mint** - Soft accent
- Hex: `#95d5b2`
- RGB: `rgb(149, 213, 178)`
- Usage: Backgrounds, subtle accents

**Sage** - Light background
- Hex: `#d8f3dc`
- RGB: `rgb(216, 243, 220)`
- Usage: Card backgrounds, light sections

### Supporting Colors

**Warm Orange** - Energy and enthusiasm
- Hex: `#ff9f1c`
- RGB: `rgb(255, 159, 28)`
- Usage: Celebration moments, achievements, CTAs

**Coral** - Friendly warmth
- Hex: `#ffbf69`
- RGB: `rgb(255, 191, 105)`
- Usage: Highlights, badges

**Deep Blue** - Trust and intelligence
- Hex: `#2c3e50`
- RGB: `rgb(44, 62, 80)`
- Usage: Text, professional sections

**Sky Blue** - Calm and clarity
- Hex: `#4a90e2`
- RGB: `rgb(74, 144, 226)`
- Usage: Information, links

### Neutral Colors

**White**
- Hex: `#ffffff`
- Usage: Backgrounds, text on dark

**Off-White**
- Hex: `#f8f9fa`
- Usage: Subtle backgrounds

**Light Gray**
- Hex: `#e9ecef`
- Usage: Borders, dividers

**Gray**
- Hex: `#6c757d`
- Usage: Secondary text

**Dark Gray**
- Hex: `#343a40`
- Usage: Primary text, headings

**Almost Black**
- Hex: `#212529`
- Usage: Heavy text, dark mode

### Semantic Colors

**Success Green**
- Hex: `#28a745`
- Usage: Success messages, completed states

**Warning Yellow**
- Hex: `#ffc107`
- Usage: Warnings, caution states

**Error Red**
- Hex: `#dc3545`
- Usage: Errors, alerts

**Info Blue**
- Hex: `#17a2b8`
- Usage: Informational messages

## Typography

### Primary Font: Jost

**Jost** is a clean, geometric sans-serif font that's modern, friendly, and highly readable.

- Font Family: `'Jost', sans-serif`
- Font Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Google Fonts: `https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap`

### Font Hierarchy

**Display Heading** (H1)
- Size: 48px / 3rem
- Weight: 700 (Bold)
- Line Height: 1.2
- Use: Page titles, hero headings

**Large Heading** (H2)
- Size: 36px / 2.25rem
- Weight: 600 (SemiBold)
- Line Height: 1.3
- Use: Section headings

**Medium Heading** (H3)
- Size: 28px / 1.75rem
- Weight: 600 (SemiBold)
- Line Height: 1.4
- Use: Subsection headings

**Small Heading** (H4)
- Size: 22px / 1.375rem
- Weight: 500 (Medium)
- Line Height: 1.4
- Use: Card headings, smaller sections

**Tiny Heading** (H5, H6)
- Size: 18px / 1.125rem
- Weight: 500 (Medium)
- Line Height: 1.5
- Use: Labels, small headings

**Body Large**
- Size: 18px / 1.125rem
- Weight: 400 (Regular)
- Line Height: 1.6
- Use: Intro paragraphs, important text

**Body**
- Size: 16px / 1rem
- Weight: 400 (Regular)
- Line Height: 1.6
- Use: Standard body text

**Body Small**
- Size: 14px / 0.875rem
- Weight: 400 (Regular)
- Line Height: 1.5
- Use: Secondary text, captions

**Caption**
- Size: 12px / 0.75rem
- Weight: 400 (Regular)
- Line Height: 1.4
- Use: Labels, metadata, footnotes

## Spacing System

Use a consistent 4px-based spacing scale:

- `xs`: 4px (0.25rem)
- `sm`: 8px (0.5rem)
- `md`: 16px (1rem)
- `lg`: 24px (1.5rem)
- `xl`: 32px (2rem)
- `2xl`: 48px (3rem)
- `3xl`: 64px (4rem)
- `4xl`: 96px (6rem)

## Border Radius

- `none`: 0
- `sm`: 4px (0.25rem) - Small elements
- `md`: 8px (0.5rem) - Buttons, inputs
- `lg`: 12px (0.75rem) - Cards
- `xl`: 16px (1rem) - Large cards
- `2xl`: 24px (1.5rem) - Hero sections
- `full`: 9999px - Pills, circular elements

## Shadows

**Small** - Subtle elevation
```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
```

**Medium** - Card elevation
```css
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
```

**Large** - Prominent elements
```css
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 6px 6px rgba(0, 0, 0, 0.1);
```

**XL** - Modals, overlays
```css
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04);
```

## Glassmorphism Style

A signature SmartCamp.AI design pattern for cards and containers.

```css
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

Variations:
- **Light**: `rgba(255, 255, 255, 0.1)` - Subtle transparency
- **Medium**: `rgba(255, 255, 255, 0.15)` - Standard
- **Heavy**: `rgba(255, 255, 255, 0.25)` - More opaque

## Background Patterns

### Jungle Background

Primary background for all SmartCamp.AI applications.

- **Image**: `jungle-background.png` (or `jungle-background.jpg`)
- **Pattern**: Dense tropical foliage with depth
- **Color Tone**: Deep greens with natural variation
- **Usage**: Full-page background with overlay

**Implementation**:
```css
body {
  background-image: url('/jungle-background.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

/* Overlay for readability */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 77, 46, 0.3);
  z-index: -1;
}
```

### Alternative: Gradient Overlays

For sections without jungle background:
```css
background: linear-gradient(135deg, #1a4d2e 0%, #2d6a4f 100%);
```

## Logo Usage

### Primary Logo
- **File**: `SmartCampAI.png` (or `.svg` for scalability)
- **Mascot**: Friendly AI-powered camp counselor character
- **Usage**: Headers, footers, marketing materials

### Logo Variations
- **Full Color**: On light backgrounds
- **White**: On dark or photo backgrounds
- **Icon Only**: Small spaces, favicons

### Spacing & Clearance
- Maintain minimum clearance of logo height × 0.5 on all sides
- Never stretch or distort logo
- Never alter colors
- Never add effects (shadows, glows)

### Minimum Size
- Digital: 120px width minimum
- Print: 1 inch width minimum

## Iconography

**Style**: Line icons with rounded edges
**Stroke Width**: 2px
**Size**: 20px, 24px, 32px, 48px
**Library**: Lucide React (for consistency)

**Icon Colors**:
- Primary actions: Jungle Green (#1a4d2e)
- Secondary: Gray (#6c757d)
- Interactive: Mint Green (#52b788)
- Disabled: Light Gray (#e9ecef)

## Buttons

### Primary Button
```css
background: #1a4d2e;
color: #ffffff;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
transition: all 0.3s ease;

&:hover {
  background: #2d6a4f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 77, 46, 0.3);
}
```

### Secondary Button
```css
background: transparent;
color: #1a4d2e;
border: 2px solid #1a4d2e;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;

&:hover {
  background: #1a4d2e;
  color: #ffffff;
}
```

### Accent Button (CTA)
```css
background: #ff9f1c;
color: #ffffff;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;

&:hover {
  background: #ffbf69;
}
```

### Ghost Button
```css
background: transparent;
color: #2c3e50;
padding: 12px 24px;

&:hover {
  background: rgba(0, 0, 0, 0.05);
}
```

## Form Inputs

```css
input, textarea, select {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #52b788;
  box-shadow: 0 0 0 3px rgba(82, 183, 136, 0.1);
}

input::placeholder {
  color: #6c757d;
}
```

## Cards

```css
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Glass variant */
.card-glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## Animations

### Timing Functions
- **Ease Out**: Default for entrances (`cubic-bezier(0, 0, 0.2, 1)`)
- **Ease In**: Exits (`cubic-bezier(0.4, 0, 1, 1)`)
- **Ease In Out**: Two-way animations (`cubic-bezier(0.4, 0, 0.2, 1)`)

### Durations
- **Fast**: 150ms - Small interactions
- **Normal**: 300ms - Standard transitions
- **Slow**: 500ms - Large movements
- **Slower**: 700ms - Page transitions

### Common Animations

**Fade In**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 300ms ease-out;
```

**Slide Up**:
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: slideUp 500ms ease-out;
```

**Scale In**:
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
animation: scaleIn 300ms ease-out;
```

## Footer Requirements

**Every SmartCamp.AI application must include**:

```html
<footer>
  <p>© Created with ❤️ by <a href="https://smartcamp.ai/">SmartCamp.AI</a></p>
</footer>
```

**Styling**:
```css
footer {
  text-align: center;
  padding: 24px;
  color: #6c757d;
  font-size: 14px;
}

footer a {
  color: #1a4d2e;
  text-decoration: none;
  font-weight: 500;
}

footer a:hover {
  color: #52b788;
  text-decoration: underline;
}
```

## Accessibility

- **Contrast Ratios**: Minimum 4.5:1 for body text, 3:1 for large text
- **Focus States**: Visible focus indicators on all interactive elements
- **Alt Text**: All images must have descriptive alt attributes
- **Keyboard Navigation**: Full keyboard accessibility
- **ARIA Labels**: Use appropriate ARIA attributes for screen readers

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1536px
- **Wide**: ≥ 1536px

### Mobile-First Approach
Design for mobile first, then enhance for larger screens.

## Voice & Tone

### Brand Voice
- **Friendly**: Warm and approachable
- **Encouraging**: Positive and supportive
- **Clear**: Simple and direct language
- **Enthusiastic**: Excited about learning
- **Trustworthy**: Reliable and professional

### Writing Guidelines
- Use active voice
- Keep sentences short and clear
- Avoid jargon unless necessary
- Be inclusive and welcoming
- Celebrate achievements
- Encourage curiosity

## Asset Locations

All brand assets should be stored in `/branding/` or `/public/`:

- `SmartCampAI.png` - Primary logo
- `SmartCampAI.svg` - Vector logo
- `jungle-background.png` - Main background image
- `favicon.ico` - Favicon
- `og-image.png` - Open Graph image for social sharing
- `mascot-*.png` - Mascot variations

## Project-Specific Adaptations

When creating project-specific variations (like CosmosKids):

1. **Maintain Core Brand**: Keep SmartCamp.AI colors, typography, and glassmorphism
2. **Add Theme Accents**: Introduce project-specific colors and imagery
3. **Consistent Footer**: Always include SmartCamp.AI attribution
4. **Logo Adaptation**: Can create project-specific logo that incorporates SmartCamp.AI identity
5. **Background Variations**: Can adapt jungle background or add theme-specific overlays

### Example: CosmosKids Adaptations
- **Additional Colors**: Deep space blues (#0f0f23, #1a1a3e), cosmic purples (#6b46c1), star yellows (#ffd700)
- **Background**: Jungle background with cosmic overlay or stars
- **Icons**: Space-themed while maintaining line style
- **Mascots**: Astronaut characters alongside SmartCamp.AI mascot
