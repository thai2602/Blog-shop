# UI UPDATES - Dribbble Style

## 🎨 PHONG CÁCH THIẾT KẾ

Lấy cảm hứng từ Dribbble với:
- **Clean & Modern**: Giao diện sạch sẽ, hiện đại
- **Generous Spacing**: Khoảng cách rộng rãi, thoáng đãng
- **Smooth Transitions**: Hiệu ứng mượt mà, tinh tế
- **Soft Shadows**: Bóng đổ nhẹ nhàng, không quá nặng
- **Rounded Corners**: Bo góc mềm mại (rounded-2xl, rounded-3xl)
- **Gradient Accents**: Gradient nhẹ cho header sections

---

## ✨ CẬP NHẬT CHI TIẾT

### 1. Home Page
**Không thay đổi** - Đã đẹp rồi với:
- Hero section với gradient overlay
- Feature cards với hover effects
- Smooth carousel cho products và posts
- CTA section với gradient background

### 2. Shop Page

#### Header
- ✅ Gradient background: `from-blue-50 to-indigo-50`
- ✅ Larger heading: `text-5xl` thay vì `text-4xl`
- ✅ Better spacing: `py-12` thay vì `py-8`
- ✅ Rounded corners: `rounded-3xl`

#### Sidebar
- ✅ Wider sidebar: `280px` thay vì `260px`
- ✅ Icon màu blue cho Categories
- ✅ Active state: `bg-blue-50 text-blue-700` với shadow
- ✅ Rounded buttons: `rounded-xl`
- ✅ Hover effects: `hover:bg-blue-50 hover:text-blue-600`
- ✅ Better spacing: `gap-3` cho icons

#### Products Section
- ✅ Larger heading: `text-3xl`
- ✅ Better filter display với blue accent
- ✅ Cleaner layout

### 3. Blog Page

#### Header
- ✅ Gradient background: `from-green-50 to-emerald-50`
- ✅ Larger heading: `text-5xl`
- ✅ Better description text
- ✅ Rounded corners: `rounded-3xl`

#### Sidebar
- ✅ Wider sidebar: `280px` → `72` (lg:w-72)
- ✅ Icon cho Categories heading
- ✅ Active state: `bg-green-50 text-green-700`
- ✅ Rounded buttons: `rounded-xl`
- ✅ Better spacing

#### Blog Cards
- ✅ Taller images: `h-56` thay vì `h-48`
- ✅ Date badge: Floating badge trên ảnh
- ✅ Gradient overlay on hover
- ✅ Category tags: `bg-green-50 text-green-700` với border
- ✅ Hover color: `group-hover:text-green-600`
- ✅ Smooth transitions: `duration-700` cho scale effect

### 4. Product Cards

#### Default ProductCard
- ✅ Border hover: `hover:border-blue-200`
- ✅ Gradient overlay on hover
- ✅ Featured badge: Yellow badge cho featured products
- ✅ Larger text: `text-lg` cho title, `text-xl` cho price
- ✅ "View →" text xuất hiện on hover
- ✅ Hover color: `group-hover:text-blue-600`
- ✅ Better padding: `p-5` thay vì `p-4`

#### ProductCardAlbum
- ✅ Purple theme: `hover:border-purple-200`
- ✅ Hover color: `group-hover:text-purple-600`
- ✅ "View →" text on hover
- ✅ Consistent styling với ProductCard

---

## 🎯 DESIGN TOKENS

### Colors
```css
/* Primary Colors */
Blue: #3B82F6 (blue-600)
Green: #10B981 (green-600)
Purple: #8B5CF6 (purple-600)
Orange: #F97316 (orange-600)

/* Backgrounds */
Blue Light: from-blue-50 to-indigo-50
Green Light: from-green-50 to-emerald-50
Gray Light: bg-gray-50

/* Borders */
Default: border-gray-100
Hover Blue: border-blue-200
Hover Green: border-green-200
Hover Purple: border-purple-200
```

### Spacing
```css
/* Padding */
Card: p-5 (20px)
Section: py-12 (48px)
Header: py-12 px-8

/* Gap */
Grid: gap-6 (24px)
Flex: gap-3 (12px)
```

### Border Radius
```css
/* Rounded */
Small: rounded-xl (12px)
Medium: rounded-2xl (16px)
Large: rounded-3xl (24px)
Full: rounded-full
```

### Shadows
```css
/* Box Shadow */
Default: shadow-sm
Hover: shadow-xl
Featured: shadow-lg
```

### Transitions
```css
/* Duration */
Fast: duration-300
Normal: duration-500
Slow: duration-700

/* Easing */
All: transition-all
Colors: transition-colors
Transform: transition-transform
Opacity: transition-opacity
```

---

## 🔄 HOVER EFFECTS

### Cards
1. **Scale Image**: `group-hover:scale-110` với `duration-700`
2. **Gradient Overlay**: Opacity 0 → 100
3. **Border Color**: gray-100 → color-200
4. **Shadow**: shadow-sm → shadow-xl
5. **Text Color**: gray-900 → color-600
6. **Show Arrow**: "View →" opacity 0 → 100

### Buttons
1. **Background**: Lighter shade on hover
2. **Transform**: Slight translate or scale
3. **Shadow**: Increase shadow on hover

### Sidebar Items
1. **Background**: Transparent → color-50
2. **Text Color**: gray-700 → color-600
3. **Border Radius**: rounded-xl
4. **Active State**: Bold + shadow

---

## 📱 RESPONSIVE

### Breakpoints
- Mobile: Default
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)
- Large: `xl:` (1280px)

### Grid Layouts
```css
/* Shop Products */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Blog Posts */
grid-cols-1 md:grid-cols-2

/* Features */
md:grid-cols-2 lg:grid-cols-4
```

---

## ✅ CHECKLIST

### Completed
- [x] Shop page header với gradient
- [x] Shop sidebar với better styling
- [x] Blog page header với gradient
- [x] Blog sidebar với icons
- [x] Blog cards với date badge
- [x] Product cards với featured badge
- [x] Hover effects cho tất cả cards
- [x] Consistent color scheme
- [x] Better spacing và padding
- [x] Smooth transitions

### Not Changed (Already Good)
- [x] Home page
- [x] Navbar
- [x] Footer
- [x] Contact page
- [x] Detail pages

---

## 🎨 COLOR THEMES BY PAGE

| Page | Primary Color | Accent | Background |
|------|--------------|--------|------------|
| Home | Black/White | Orange | Gray-50 |
| Shop | Blue | Blue-600 | Blue-50 |
| Blog | Green | Green-600 | Green-50 |
| Albums | Purple | Purple-600 | Purple-50 |
| Contact | Orange | Orange-600 | Orange-50 |

---

## 💡 DESIGN PRINCIPLES

1. **Consistency**: Cùng pattern cho tất cả cards
2. **Hierarchy**: Clear visual hierarchy với font sizes
3. **Whitespace**: Generous spacing giữa elements
4. **Feedback**: Clear hover states cho interactive elements
5. **Performance**: Smooth transitions không lag
6. **Accessibility**: Good contrast ratios
7. **Mobile-first**: Responsive trên mọi devices

---

## 🚀 NEXT STEPS (Optional)

### Có thể cải thiện thêm:
- [ ] Add skeleton loaders
- [ ] Add empty states với illustrations
- [ ] Add micro-interactions
- [ ] Add page transitions
- [ ] Add scroll animations
- [ ] Optimize images với lazy loading
- [ ] Add dark mode support

---

*Updated: December 14, 2025*
*Style Reference: Dribbble.com*
