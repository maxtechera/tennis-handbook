# Database Schema Management with Drizzle

This project uses Drizzle ORM with PostgreSQL for type-safe database operations and schema management.

## How It Works

### 1. Schema Definition
- Schema defined in `api/db/schema.ts`
- Type-safe operations with full TypeScript support
- Automatic unique constraints and indexes
- Comprehensive field definitions

### 2. Schema Management
Use Drizzle's native `db:push` command for schema synchronization:

```bash
# Sync schema changes to database (recommended)
npm run db:push

# Generate migration files (optional)
npm run db:generate

# Apply migration files (if using migration workflow)
npm run db:migrate
```

### 3. Development Workflow
1. **Modify schema** in `api/db/schema.ts`
2. **Push changes** with `npm run db:push`
3. **Review changes** and confirm in the interactive prompt
4. **Deploy** - schema changes are applied directly

## Schema Features

### Email Captures
- ✅ Unique constraint on email
- ✅ ConvertKit sync tracking
- ✅ Processing timestamps
- ✅ Automatic conflict resolution

### Wizard Submissions
- ✅ Comprehensive step tracking
- ✅ Flat fields for analytics
- ✅ JSONB for complex data
- ✅ Engagement metrics

### Users & Events
- ✅ Full user profiles
- ✅ Conversion tracking
- ✅ Foreign key relationships
- ✅ Optimized indexes

## Benefits

1. **No ON CONFLICT errors** - Proper unique constraints
2. **Type safety** - Full TypeScript integration
3. **Automatic deployment** - Zero-configuration migrations
4. **Performance** - Cached migration checks
5. **Reliability** - Graceful error handling

## Configuration

### Environment Variables
```env
POSTGRES_URL=your-database-url
MIGRATION_SECRET=your-auth-token # Optional for manual API calls
```

### Drizzle Config
```typescript
// drizzle.config.ts
export default defineConfig({
  schema: './api/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

## Migration Files

### Location
- Generated: `drizzle/[timestamp]_[name].sql`
- Schema: `api/db/schema.ts`
- Runner: `api/db/auto-migrate.js`

### Automatic Execution
```javascript
import { ensureMigrations } from './db/auto-migrate.js';

// Runs automatically before database operations
await ensureMigrations();
```

## Troubleshooting

### Common Issues
1. **Import paths** - Use `.js` extensions in imports
2. **Module types** - Ensure `"type": "module"` in package.json
3. **Cache issues** - Migrations cached for 5 minutes

### Debug Commands
```bash
# Check schema status
npm run db:introspect

# View database in browser
npm run db:studio

# Force migration
npm run db:migrate-auto
```

## Development Workflow

1. **Modify schema** in `api/db/schema.ts`
2. **Generate migration** with `npm run db:generate`
3. **Review SQL** in generated file
4. **Deploy changes** - migrations run automatically
5. **Verify** with `npm run db:studio`

The system handles all the complexity of database migrations automatically while providing type safety and reliability.