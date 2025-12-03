# Ganhos Bybit

A cryptocurrency investment platform with an administrative panel. The user interface is in Portuguese (Brazilian), while the admin interface is in English.

## Features

### User Features (Portuguese Interface)

- **Landing Page** - Attractive landing page with investment plan information
- **User Registration** - Account creation with administrative approval system
- **User Dashboard** - Complete dashboard with:
  - Balance and statistics visualization
  - Investment plans (Starter, Professional, Premium)
  - PIX deposit system
  - Withdrawal system with configurable fees
  - Complete transaction history
- **Account States**:
  - Pending approval
  - Approved/Active
  - Rejected

### Admin Features (English Interface)

- **Admin Dashboard** - Complete administrative panel with:
  - Real-time statistics
  - User management (approve/reject registrations)
  - Transaction management (approve/reject deposits and withdrawals)
  - User balance editing
  - Platform settings (PIX, fees, limits)

## Investment Plans

| Plan | Investment Range | Daily Return | Monthly Return |
|------|------------------|--------------|----------------|
| Starter | R$ 100 - R$ 999 | 1.5% | up to 45% |
| Professional | R$ 1,000 - R$ 4,999 | 2.0% | up to 60% |
| Premium | R$ 5,000+ | 2.5% | up to 75% |

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context + TanStack React Query
- **Routing**: React Router DOM
- **Database**: Supabase
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```bash
# Clone the repository
git clone https://github.com/bitgogle/ganhos-bybit.git

# Navigate to the project directory
cd ganhos-bybit

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Public landing page |
| `/login` | User and admin login |
| `/register` | New user registration |
| `/dashboard` | User dashboard (requires login) |
| `/pending-approval` | Approval waiting page |
| `/rejected` | Registration rejected page |
| `/admin` | Admin panel (requires admin login) |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── admin/        # Admin panel components
│   └── withdrawal/   # Withdrawal-related components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── integrations/     # External service integrations (Supabase)
├── lib/              # Utility functions
├── pages/            # Page components
└── assets/           # Static assets
```

## Design

- **Primary Colors**: Black (#0a0a0a) and Gold (#f7931a)
- **Theme**: Elegant and professional dark mode
- **Responsive**: Fully adaptable for mobile, tablet, and desktop
- **Animations**: Smooth transitions and modern visual effects

## User Flow

1. **Registration**: User registers with personal data
2. **Pending**: Account is pending administrative approval
3. **Approval**: Admin approves or rejects the registration
4. **Dashboard**: User accesses dashboard and views plans
5. **Deposit**: User requests deposit via PIX
6. **Deposit Approval**: Admin approves the deposit
7. **Active Investment**: Balance is credited and starts earning
8. **Withdrawal**: User can request withdrawal at any time
9. **Processing**: Admin processes and approves the withdrawal

## License

This project is private and proprietary.
