# **App Name**: CarHub

## Core Features:

- User Authentication: Implement signup/login with email and password.
- Car Listings & Search: Display available cars with relevant details and allow users to search and filter them.
- Car Details Page: Show detailed information about each car, including description, features, and availability.
- Booking Request: Enable users to submit booking requests for specific dates.
- Booking Management (Users): Allow users to view and manage their booking requests.
- Admin Dashboard: Provide an interface for managing cars, availability, rental rules, and booking requests.

## Style Guidelines:

- **Font Family**: Inter, sans-serif (clean, modern, highly legible).
- **Headings (H1–H3)**: Bold, uppercase/larger font sizes, primary color `#1E293B`.
- **Body Text**: Regular weight, size 16px–18px, color `#111827`.
- **Links & Actions**: Accent color `#2DD4BF`, medium weight, underline on hover.
- Use a responsive **12-column grid** with consistent spacing. Cards per row: 3 on desktop, 2 on tablet, 1 on mobile.
- Cards (Car Listings): Rounded corners (`rounded-2xl`). Shadow for depth (`shadow-md hover:shadow-lg`). Image on top, details below (title, price/day, CTA button). Hover effect: scale slightly + teal border accent.
- Navigation Bar: Sticky top, dark background (`#1E293B`). Logo left, links center/right, CTA button highlighted in teal.
- Buttons: Primary: Teal background `#2DD4BF`, white text, hover → darker teal. Secondary: White background, Midnight Blue border, hover → fill Midnight Blue with white text.
- Forms/Inputs: Rounded (`rounded-lg`), subtle border, focus state → teal outline.
- Use **Remix Icon or Font Awesome**. Vehicle categories → SUV, sedan, hatchback, luxury (car-outline icons).
- Car cards scale up slightly + shadow deepen. Buttons change background/outline with smooth transition (`transition-all duration-300`).
- Use **fade/slide animations** for smoother navigation.
- Skeleton screens for car listings. Spinners in teal for async actions.
- Mobile-first design → cards stack vertically, buttons full width.
- Tablet → two cards per row, navigation collapses to hamburger menu.
- Desktop → grid-based layout with up to 3–4 cards per row.
- **Primary Color**: Midnight Blue `#1E293B` → used for navbar, headings, primary buttons.
- **Background Color**: Light Gray `#F9FAFB` → main background for pages, sections, and cards.
- **Accent Color**: Teal `#2DD4BF` → used for interactive elements (CTA buttons, links, highlights).
- **Neutral Shades**: White `#FFFFFF` → cards, form inputs.
- **Neutral Shades**: Gray `#6B7280` → body text, secondary buttons, placeholders.
- **Neutral Shades**: Dark Gray `#111827` → high contrast text..