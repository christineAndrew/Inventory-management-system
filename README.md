# Shop1 - E-commerce Management System

A full-stack e-commerce management system built with Django (backend) and React (frontend) using GraphQL for API communication.

## Project Structure

```
shop1/
├── backendshop/backend/     # Django backend with GraphQL API
├── frontend/                # React frontend with Vite
├── start_dev_servers.sh     # Development server startup script
└── README.md               # This file
```

## Technologies Used

### Backend
- **Django 5.2.5** - Python web framework
- **GraphQL** - API query language (via graphene-django)
- **PostgreSQL** - Database (configured)
- **Django CORS Headers** - Cross-origin resource sharing

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite 7** - Fast build tool and development server
- **Apollo Client** - GraphQL client
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

## Features

- **Product Management**: Create, read, update, delete products
- **Sales Management**: Record and track sales transactions  
- **Inventory Tracking**: Monitor stock levels and product information
- **Dashboard Analytics**: View profit/loss data and sales metrics
- **GraphQL API**: Efficient data querying and mutations
- **Responsive UI**: Mobile-friendly interface with Tailwind CSS

## Quick Start

### Prerequisites
- Python 3.10+ 
- Node.js 20.17+ (note: Vite requires 20.19+, but works with warnings)
- PostgreSQL (configured) or SQLite (fallback)

### 1. Run Both Servers (Recommended)

Use the provided startup script to run both backend and frontend servers simultaneously:

```bash
cd "/home/egoridc25/Pictures/commited files/shop1"
./start_dev_servers.sh
```

This will start:
- Django backend at: http://127.0.0.1:8000
- GraphQL playground at: http://127.0.0.1:8000/graphql/
- React frontend at: http://localhost:5173

### 2. Run Servers Individually

#### Backend Only
```bash
cd "backendshop/backend"
python3 manage.py runserver 127.0.0.1:8000
```

#### Frontend Only  
```bash
cd frontend
npm run dev
```

## API Endpoints

- **GraphQL API**: `http://127.0.0.1:8000/graphql/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`

## Available GraphQL Operations

### Queries
- `products` - Get all products with optional search
- `product(id)` - Get single product by ID
- `sales` - Get sales with optional date filters
- `dashboardData` - Get dashboard statistics
- `recentSales` - Get recent sales data
- `profitLossData` - Get profit/loss analytics

### Mutations
- `createProduct` - Create new product
- `updateProduct` - Update existing product
- `deleteProduct` - Delete product
- `createSale` - Create new sale transaction

## Development Notes

### Database
The project is configured for PostgreSQL but has been tested to work with the existing SQLite database. Make sure database migrations are applied:

```bash
cd backendshop/backend
python3 manage.py migrate
```

### Environment Variables
Frontend uses Vite environment variables. The GraphQL endpoint defaults to:
- `VITE_GRAPHQL_URI=http://localhost:8000/graphql/`

### Node.js Version Warning
The frontend may show warnings about Node.js version compatibility (requires 20.19+ but works with 20.17+). The application runs successfully despite these warnings.

## Troubleshooting

### Port Conflicts
- Backend default: port 8000
- Frontend default: port 5173  
- If ports are in use, modify the servers manually or kill existing processes

### Database Issues
- Ensure PostgreSQL is running or switch to SQLite in Django settings
- Run migrations after model changes: `python3 manage.py makemigrations && python3 manage.py migrate`

### GraphQL Schema Issues
- Visit http://127.0.0.1:8000/graphql/ to test queries directly
- Check Django server logs for GraphQL errors

## File Locations

- **Django Settings**: `backendshop/backend/backend/settings.py`
- **GraphQL Schema**: `backendshop/backend/inventory/schema.py`
- **React App**: `frontend/src/App.tsx`
- **Apollo Client Config**: `frontend/src/api/client.ts`

## Next Steps

1. Create a superuser for Django admin: `python3 manage.py createsuperuser`
2. Add sample products through GraphQL playground or admin interface
3. Test the full sales workflow from frontend to backend
4. Configure production environment variables and database
