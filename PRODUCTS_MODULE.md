# Digital Products Module

A complete digital products management system for BoostLinkPro, allowing creators to sell PDFs, videos, courses, templates, and more with instant delivery.

## 🎯 Features

### Core Functionality

- ✅ Upload and manage digital products (PDF, Video, Audio, Course, Template, Other)
- ✅ Set custom pricing in INR
- ✅ Toggle product active/inactive status
- ✅ Edit product details
- ✅ Delete products (with file cleanup)
- ✅ Public checkout pages for each product
- ✅ Copy shareable checkout links
- ✅ Track sales count and revenue
- ✅ File upload with drag & drop (up to 500MB)
- ✅ Instant file delivery after purchase

### Product Types Supported

1. **PDF** - Ebooks, guides, worksheets, templates
2. **Video** - Tutorials, courses, masterclasses
3. **Audio** - Podcasts, music, audiobooks
4. **Course** - Multi-part educational content
5. **Template** - Notion, Canva, design templates
6. **Other** - Any other digital content

## 📁 File Structure

```
frontend2/src/app/
├── dashboard/products/
│   └── page.tsx              # Products management dashboard
└── checkout/[productId]/
    └── page.tsx              # Public checkout page

backend/src/
├── routes/
│   └── products.ts           # API routes
└── controllers/
    └── products.ts           # Business logic
```

## 🔧 Technical Architecture

### Frontend Components

#### 1. **ProductsPage** (`dashboard/products/page.tsx`)

Main dashboard for product management.

**Components:**

- `ProductModal` - Create/edit product dialog
- `ProductCard` - Individual product display with actions
- `StatsCard` - Analytics display
- `EmptyState` - Onboarding for new users

**Features:**

- Real-time updates with React Query
- Responsive grid layout
- Instagram-branded UI
- Toast notifications

#### 2. **CheckoutPage** (`checkout/[productId]/page.tsx`)

Public-facing product purchase page.

**Features:**

- Product details display
- Secure checkout form
- Email validation
- Payment integration ready (Razorpay/Stripe)
- Responsive 2-column layout

### Backend API Endpoints

#### Protected Routes (require authentication)

**GET `/api/products`**

```typescript
// Get all products for authenticated user
Response: {
  success: true,
  data: Product[]
}
```

**POST `/api/products`**

```typescript
// Create new product
Body: FormData {
  name: string,
  description: string,
  price_cents: number,
  type: 'pdf' | 'video' | 'audio' | 'course' | 'template' | 'other',
  file?: File
}
Response: {
  success: true,
  data: Product
}
```

**PATCH `/api/products/:id`**

```typescript
// Update product (partial update supported)
Body: FormData {
  name?: string,
  description?: string,
  price_cents?: number,
  type?: string,
  file?: File
}
Response: {
  success: true,
  data: Product
}
```

**DELETE `/api/products/:id`**

```typescript
// Delete product and associated file
Response: {
  success: true;
}
```

**PATCH `/api/products/:id/toggle`**

```typescript
// Toggle is_active status
Response: {
  success: true,
  data: Product
}
```

#### Public Routes

**GET `/api/products/public/:id`**

```typescript
// Get single active product (no auth required)
Response: {
  success: true,
  data: Product
}
```

### Database Schema

```sql
create table public.products (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade,
  name          text not null,
  description   text default '',
  price_cents   int not null check (price_cents >= 99),
  type          text not null check (type in ('pdf','video','audio','course','template','other')),
  file_url      text,
  thumbnail_url text,
  is_active     boolean default true,
  sales_count   int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
```

### File Storage

**Platform:** Supabase Storage  
**Bucket:** `product-files`  
**Path Format:** `{user_id}/{timestamp}.{extension}`  
**Max Size:** 500MB  
**Access:** Public URLs generated for file delivery

## 🎨 UI/UX Design

### Design System

- **Primary Gradient:** Instagram colors (#f09433 → #dc2743 → #bc1888)
- **Font:** DM Sans
- **Border Radius:** 12-24px
- **Shadows:** Layered depth with blur
- **Animations:** Smooth transitions (0.2s)

### Product Card

- Type-specific icon and color coding
- Active/Inactive visual indicator
- Price and sales statistics
- Quick actions: Edit, Toggle, Delete, Copy Link
- Truncated description (2 lines max)
- Creation date footer

### Modal Design

- Instagram gradient header
- Sectioned form layout
- Drag & drop file upload
- Real-time validation
- Loading states
- Error handling

## 🚀 Usage Guide

### Creating a Product

1. Click "Add Product" button
2. Select product type (PDF, Video, etc.)
3. Enter product name and description
4. Set price in INR (minimum ₹0.99)
5. (Optional) Upload file via drag & drop or browse
6. Click "Create Product"

### Managing Products

**Edit Product:**

- Click edit icon on product card
- Update details in modal
- Save changes

**Toggle Visibility:**

- Click eye icon to hide/show product
- Inactive products appear grayed out
- Not visible on checkout pages

**Delete Product:**

- Click trash icon
- Confirm deletion
- File automatically removed from storage

**Share Product:**

- Click "Copy Link" button
- Share checkout URL with customers
- Preview with external link icon

### Checkout Flow

1. Customer visits `/checkout/{productId}`
2. Views product details and price
3. Fills checkout form (name, email, phone)
4. Completes payment (integration pending)
5. Receives download link via email

## 🔐 Security

### Authentication

- All management routes protected with JWT middleware
- User can only access their own products
- Public checkout pages accessible without auth

### File Upload

- Size limit enforced (500MB)
- File type validation
- Secure storage with Supabase
- Automatic cleanup on product deletion

### Data Validation

- Zod schema validation on backend
- Frontend form validation
- SQL injection prevention (parameterized queries)
- XSS prevention (React escaping)

## 📊 Analytics

### Metrics Tracked

- Total products count
- Active products count
- Total sales across all products
- Total revenue (in INR)
- Per-product sales count

### Future Enhancements

- Sales history tracking
- Customer database
- Revenue charts and trends
- Export data to CSV
- Email notifications on sales

## 🔗 Integration Points

### Payment Gateways (To Implement)

```typescript
// Razorpay Integration
const order = await razorpay.orders.create({
  amount: product.price_cents,
  currency: "INR",
  receipt: `order_${Date.now()}`,
});

// Stripe Integration
const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: { name: product.name },
        unit_amount: product.price_cents,
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${BASE_URL}/checkout/${product.id}`,
});
```

### Email Delivery (To Implement)

```typescript
// Send download link after payment
await sendEmail({
  to: customerEmail,
  subject: `Your ${product.name} is ready!`,
  template: "product-delivery",
  data: {
    productName: product.name,
    downloadUrl: product.file_url,
    expiresIn: "30 days",
  },
});
```

### Instagram DM Integration

```typescript
// Auto-send product link in DM automation
const automation = {
  keywords: ["buy guide", "purchase"],
  dm_message: `Thanks! Get your ${product.name} here: ${checkoutUrl}`,
};
```

## 🐛 Error Handling

### Frontend

- Network errors → Toast notification
- Validation errors → Inline form feedback
- Loading states → Spinner animations
- Empty states → Helpful onboarding UI

### Backend

- Invalid input → 400 Bad Request with details
- Not found → 404 with descriptive message
- Server errors → 500 with sanitized error
- File upload fails → Rollback transaction

## 🧪 Testing Checklist

- [ ] Create product with file
- [ ] Create product without file
- [ ] Edit product details
- [ ] Upload file to existing product
- [ ] Toggle active/inactive status
- [ ] Delete product (verify file removed)
- [ ] Copy checkout link
- [ ] View checkout page (logged out)
- [ ] Submit checkout form
- [ ] Verify responsive design (mobile/tablet)
- [ ] Test file upload limits (>500MB)
- [ ] Test drag & drop upload
- [ ] Verify stats calculations

## 📝 Environment Variables

```env
# Backend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Payment Gateway (To Add)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
# OR
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

## 🚧 Roadmap

### Phase 1: Core (✅ Complete)

- [x] Product CRUD operations
- [x] File upload & storage
- [x] Checkout pages
- [x] Basic analytics

### Phase 2: Payments (In Progress)

- [ ] Razorpay integration
- [ ] Stripe integration
- [ ] Order creation
- [ ] Payment webhooks
- [ ] Email delivery

### Phase 3: Advanced Features

- [ ] Product categories
- [ ] Thumbnail uploads
- [ ] Product variations (licenses)
- [ ] Coupon codes
- [ ] Bulk actions
- [ ] Product duplication

### Phase 4: Analytics & Marketing

- [ ] Sales dashboard with charts
- [ ] Customer management
- [ ] Revenue tracking
- [ ] Affiliate system
- [ ] Product bundles
- [ ] Upsells

## 💡 Best Practices

### Code Organization

- Components separated by concern (Modal, Card, Stats)
- Reusable type definitions
- Consistent styling patterns
- Error boundaries
- Loading states

### Performance

- React Query for caching
- Optimistic updates
- Lazy loading for modals
- Image optimization (for thumbnails)
- Debounced search (future)

### Accessibility

- Semantic HTML
- Keyboard navigation
- Screen reader friendly
- Focus management
- Color contrast compliance

## 🤝 Contributing

When adding features:

1. Follow existing code patterns
2. Add TypeScript types
3. Include error handling
4. Update this documentation
5. Test on mobile devices
6. Verify accessibility

## 📞 Support

For issues or questions:

- Check console errors
- Verify environment variables
- Ensure Supabase storage bucket exists
- Check network tab for API errors
- Review backend logs

---

Built with ❤️ for BoostLinkPro creators
