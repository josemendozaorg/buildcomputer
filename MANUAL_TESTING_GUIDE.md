# Manual Testing Guide - Persona-Based PC Builder

## 🚀 App is Running!

**Local URL:** http://localhost:5173/

The development server is running and ready for manual testing.

---

## ✅ Completed Features (Test These!)

### Core User Journey

#### 1. Landing Page

- **URL:** http://localhost:5173/
- **Test:** Navigate to the build page
- **Expected:** "Get Started" button visible, clicking navigates to /build

#### 2. Persona Selection

- **URL:** http://localhost:5173/build
- **Test:** View all 8 persona cards
  - Competitive Gamer
  - Creator
  - AI Enthusiast
  - Casual Gamer
  - Student
  - Home Office
  - Streamer
  - Custom Build (with "Coming Soon" badge)
- **Expected:** Grid of 8 persona cards with titles, icons, and descriptions

#### 3. Select a Persona

- **Test:** Click on "Competitive Gamer" card
- **Expected:**
  - Card gets indigo border (selected state)
  - Budget slider appears below
  - Default budget: $2000

#### 4. Adjust Budget

- **Test:** Drag budget slider or type value
- **Expected:**
  - Budget display updates in real-time
  - Range: $500 - $5000
  - Shows formatted currency (e.g., "$2,500")

#### 5. View Build Recommendations

- **Test:** After selecting persona + budget
- **Expected:**
  - 3 build cards appear instantly:
    - Optimized Build (~90% of budget)
    - Performance Build (~100% of budget)
    - Featured Build (~125% of budget)
  - Each card shows:
    - Build title
    - Total price (formatted)
    - Capability description (persona-specific)
    - "View Details" button

#### 6. Expand Component Details ⭐ NEW!

- **Test:** Click "View Details" on any build card
- **Expected:**
  - Card expands smoothly
  - Shows real PC components:
    - **CPU** (e.g., AMD Ryzen 5 7600X)
    - **GPU** (e.g., NVIDIA GeForce RTX 4060 Ti)
    - **RAM** (e.g., G.Skill Ripjaws 32GB DDR5-6000)
    - **Storage** (e.g., Samsung 980 Pro 1TB NVMe SSD)
  - Each component displays:
    - Component type label
    - Brand and model name
    - Individual price
    - Detailed specs (cores, VRAM, capacity, speeds, etc.)
  - Button text changes to "Hide Details"

#### 7. Collapse Component Details

- **Test:** Click "Hide Details"
- **Expected:**
  - Component list disappears
  - Button reverts to "View Details"

#### 8. Switch Personas

- **Test:** Select "Creator" persona after selecting "Competitive Gamer"
- **Expected:**
  - Previous persona card deselects (border removed)
  - New persona card highlights (indigo border)
  - Build recommendations update instantly
  - Descriptions change to creator-focused (e.g., "video editing", "rendering")

### Advanced Features

#### 9. Different Personas Show Different Components

- **Test:** Compare components between personas:
  1. Select "Competitive Gamer" → View Details
  2. Note the components
  3. Select "Creator" → View Details
  4. Compare components

- **Expected:**
  - Gaming builds: Focus on high-end GPUs for FPS
  - Creator builds: Balanced CPU/GPU for rendering
  - Different component selections based on use case

#### 10. Responsive Layout

- **Test:** Resize browser window
- **Mobile** (< 640px):
  - Persona cards: 1 column, full width
  - Build cards: Stack vertically
- **Tablet** (640px - 1024px):
  - Persona cards: 2 columns
- **Desktop** (> 1024px):
  - Persona cards: 4 columns × 2 rows
  - Build cards: Can display side-by-side

#### 11. Direct URL Access

- **Test:** Navigate directly to http://localhost:5173/build
- **Expected:** Builder page loads immediately (no redirect)

---

## 🧪 Test Scenarios to Try

### Scenario A: First-Time User Flow

1. Start at landing page
2. Click "Get Started"
3. Select "Competitive Gamer"
4. Adjust budget to $3,000
5. View all 3 build recommendations
6. Expand "Performance Build" to see components
7. Note the AMD Ryzen 7 7800X3D CPU and RTX 4070 GPU

### Scenario B: Persona Comparison

1. Select "Competitive Gamer"
2. Expand "Optimized Build" → Note GPU (RTX 4060 Ti)
3. Switch to "AI Enthusiast"
4. Expand "Featured Build" → Note GPU (RTX 4090 for AI workloads)
5. Compare component differences

### Scenario C: Budget Exploration

1. Select "Student" persona
2. Set budget to $1,000 (low)
3. View Optimized Build components
4. Increase budget to $5,000 (max)
5. View Featured Build components
6. Compare component quality

### Scenario D: Mobile Testing

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Test persona selection with touch
5. Test budget slider on mobile
6. Expand build details on mobile

---

## 🎯 Real Component Examples

### Competitive Gamer - Optimized Build ($876)

- **CPU:** AMD Ryzen 5 7600X (6 cores, 12 threads, 5.3 GHz boost)
- **GPU:** NVIDIA GeForce RTX 4060 Ti (8GB GDDR6, ray tracing)
- **RAM:** G.Skill Ripjaws 32GB DDR5-6000
- **Storage:** Samsung 980 Pro 1TB NVMe (7,000 MB/s read)

### Creator - Performance Build ($1,666)

- **CPU:** AMD Ryzen 9 7900X (12 cores, 24 threads)
- **GPU:** NVIDIA GeForce RTX 4070 Ti (12GB GDDR6X, 7,680 CUDA cores)
- **RAM:** Corsair Dominator 64GB DDR5-6000
- **Storage:** WD Black SN850X 2TB NVMe

### AI Enthusiast - Featured Build ($2,826)

- **CPU:** AMD Ryzen 9 7950X (16 cores, 32 threads)
- **GPU:** NVIDIA GeForce RTX 4090 (24GB GDDR6X, 512 tensor cores)
- **RAM:** G.Skill Trident Z5 96GB DDR5-6000
- **Storage:** Samsung 990 Pro 2TB NVMe

---

## 📊 Test Coverage Summary

```
✅ Unit Tests:    65/65 passing (100%)
✅ BDD Scenarios: 9/12 passing (75%)
✅ E2E Tests:     8/8 passing (100%)
✅ Type Check:    Passing
✅ Build:         Successful
```

---

## 🐛 Known Limitations (Future Enhancements)

1. **Budget Warnings:** No yellow warning banner when budget is too low for persona
2. **Keyboard Focus Rings:** Basic keyboard navigation works, but visual focus indicators could be enhanced
3. **Touch Targets:** Touch targets meet minimum size, but could be optimized further
4. **Hover Effects:** Hover scaling/shadow effects use browser defaults

---

## 💡 Testing Tips

1. **Open Browser Console** (F12) to check for any errors
2. **Test Multiple Personas** - Each has different component recommendations
3. **Try Extreme Budgets** - $500 minimum, $5000 maximum
4. **Check Responsiveness** - Resize window or use DevTools
5. **Expand Multiple Cards** - Can expand all 3 builds simultaneously
6. **Component Specs** - Hover over specs to see full details

---

## 🚀 Next Steps

After manual testing:

1. Report any bugs or UX issues
2. Consider creating a pull request
3. Gather user feedback for iterations
4. Prioritize remaining enhancements (scenarios 6-9)

---

**Enjoy testing the Persona-Based PC Builder!** 🎮⚡
