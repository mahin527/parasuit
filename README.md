# prisuth

Express + TypeScript API with Prisma ORM on PostgreSQL.

## Requirements

- Node.js `22.18+` (or `24.11+`)
- pnpm `12+`
- PostgreSQL `15+`

## Action

```bash
# 1. install base dependencies
pnpm install

# 2. add the Prisma ORM driver for PostgreSQL
pnpm add @prisma/orm-postgres@8.0.0-rc.25

# 3. initialize Prisma (creates prisma.config.ts, contract, db client)
npx prisma@latest orm init --target postgres --authoring psl

# 4. make the CLI match the ORM driver version
#    (prisma rc.34 ships orm-toolchain rc.24, the rc.25 driver needs rc.25)
pnpm add -D prisma@8.0.0-rc.35 @prisma/cli-engine@0.10.4

# 5. create .env and put your connection string in DATABASE_URL
cp .env.example .env

# 6. emit the typed client
pnpm prisma contract emit

# 7. create the schema in the database
pnpm prisma db init

# 8. (later) after editing src/prisma/contract.prisma
pnpm prisma contract emit
pnpm prisma db update

pnpm prisma migration status
```

## Troubleshooting

### 1. `contract emit` fails with `[object Object]` and `',' expected`

Exact error:

```text
✘ [CLI.INIT_EMIT_FAILED] Failed to emit contract
  why: `prisma contract emit` failed: exited with code 2: CLI.UNEXPECTED: ',' expected. (6:9)

      > 6 | [object Object]
          |         ^
```

or:

```text
✘ [CLI.UNEXPECTED] ',' expected. (6:9)
```

**Cause:** the `prisma` CLI and `@prisma/orm-postgres` use different `@prisma/orm-toolchain` versions, so the generated `contract.d.ts` is broken.
`prisma@8.0.0-rc.34` pulls `orm-toolchain@8.0.0-rc.24`, but `@prisma/orm-postgres@8.0.0-rc.25` needs `orm-toolchain@8.0.0-rc.25`.

**Fix:**

```bash
pnpm add -D prisma@8.0.0-rc.35 @prisma/cli-engine@0.10.4
pnpm prisma contract emit
```

### 2. `ERR_PNPM_NO_AGENT_SKILLS_DIR`

Exact error:

```text
Error: ERR_PNPM_NO_AGENT_SKILLS_DIR

  × adding a new package
  ╰─▶ There is no agent skill directory to link the approved skills of prisma into
```

**Cause:** `pnpm-workspace.yaml` has `permissions.prisma.skills: true`, so pnpm approves Prisma's agent skills, but there is no directory to link them into.

**Fix:** add this to `pnpm-workspace.yaml`, then run `pnpm install`:

```yaml
skills:
    dirs:
        - .claude/skills
```

Or turn skills linking off completely:

```yaml
skills:
    dirs: []
```

> Prisma 8 does not use `@prisma/client` or `prisma generate`. Use `contract emit` instead.
