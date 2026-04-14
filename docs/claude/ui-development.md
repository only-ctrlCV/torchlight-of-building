# UI Development Guide

## Routes

**URL Structure:**
```
/                           → Saves manager (list/create/delete)
/builder                    → Redirects to /builder/equipment
/builder/equipment?id=xxx   → Equipment section
/builder/talents            → Redirects to /builder/talents/slot_1
/builder/talents/slot_1     → Talents, tree slot 1
/builder/talents/slot_2     → Talents, tree slot 2
/builder/talents/slot_3     → Talents, tree slot 3
/builder/talents/slot_4     → Talents, tree slot 4
/builder/skills             → Skills section
/builder/hero               → Hero section
/builder/pactspirit         → Pactspirit section
/builder/divinity           → Divinity section
/builder/configuration      → Configuration section
/builder/calculations       → Calculations section
```

**Key files:**
- `src/routes/__root.tsx` - Root layout with global styles
- `src/routes/index.tsx` - Saves manager
- `src/routes/builder.tsx` - Builder layout (validates `?id=` param, loads save, renders `<Outlet>`)
- `src/routes/builder/*.tsx` - Section routes (component logic inlined in route files)
- `src/routes/builder/talents/$slot.tsx` - Dynamic route with slot param validation

**Routing patterns:**
```typescript
// Redirect in beforeLoad
export const Route = createFileRoute("/builder/")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/builder/equipment", search });
  },
  component: () => null,
});

// Dynamic params with validation
export const Route = createFileRoute("/builder/talents/$slot")({
  beforeLoad: ({ params, search }) => {
    if (!TALENT_SLOT_PARAMS.includes(params.slot as TalentSlotParam)) {
      throw redirect({ to: "/builder/talents/$slot", params: { slot: "slot_1" }, search });
    }
  },
  component: TalentsSlotPage,
});

// Accessing params in component
const { slot } = Route.useParams();
const activeTreeSlot = paramToTreeSlot(slot as TalentSlotParam);
```

**Type helpers** (in `src/lib/types.ts`):
```typescript
type TalentSlotParam = "slot_1" | "slot_2" | "slot_3" | "slot_4";
const TALENT_SLOT_PARAMS = ["slot_1", "slot_2", "slot_3", "slot_4"] as const;
paramToTreeSlot(param: TalentSlotParam): TreeSlot
treeSlotToParam(slot: TreeSlot): TalentSlotParam
```

## Component Organization

Feature-organized in `src/components/`:
- `builder/` - BuilderLayout, PageTabs (section components are inlined in route files)
- `equipment/` - Gear slots, crafting, inventory
- `hero/` - Hero selection, memories, traits
- `talents/` - Talent trees, prisms, inverse images
- `divinity/` - Divinity slate placement
- `pactspirit/` - Pactspirit rings
- `skills/` - Active/passive skill selection
- `modals/` - Import/export dialogs
- `ui/` - Reusable primitives (Modal, SearchableSelect, Tooltip, Toast)

**Naming conventions:**
- `*Selector.tsx` - Selection components
- `*Inventory.tsx` - List/grid displays
- `*Crafter.tsx` - Creation interfaces
- `*Tab.tsx` - Tab content

**Note:** Section-level components are inlined directly in route files under `src/routes/builder/`.

## Component Patterns

```typescript
interface ComponentProps {
  value: string;
  onChange: (value: string) => void;
}

export const MyComponent: React.FC<ComponentProps> = ({ value, onChange }) => {
  // Minimal local state, prefer store integration
  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
      {/* content */}
    </div>
  );
};
```

**Props-driven:** Minimal internal state, prefer store integration

**Hydration safety:** Use mounted state for localStorage reads
```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

## State Integration

Components integrate with stores via hooks:
```typescript
const loadout = useLoadout();
const builderActions = useBuilderActions();
const { selectedSlot } = equipmentUIStore();
```

Feature UI stores hold ephemeral state (crafting in progress, selections):
```typescript
// equipmentUIStore - current crafting state
// talentsUIStore - prism/inverse image crafting state (tree slot is in URL)
// divinityUIStore - slate placement mode
```

## Reusable UI Components

**Modal** - Portal-based dialog with escape key support
```typescript
<Modal isOpen={open} onClose={close} title="Title">
  <ModalDescription>Content here</ModalDescription>
  <ModalActions>
    <ModalButton onClick={close}>Cancel</ModalButton>
    <ModalButton onClick={save} variant="primary">Save</ModalButton>
  </ModalActions>
</Modal>
```

**SearchableSelect** - Headless UI Combobox with filtering
```typescript
<SearchableSelect
  options={options}
  value={value}
  onChange={onChange}
  placeholder="Search..."
  size="sm" | "md" | "lg"
/>
```

**Tooltip** - Hover tooltips with positioning

## Styling (Tailwind CSS 4)

**Dark theme palette:**
- Backgrounds: `bg-zinc-900`, `bg-zinc-800`, `bg-zinc-700`
- Text: `text-zinc-50`, `text-zinc-200`, `text-zinc-400`
- Borders: `border-zinc-700`, `border-zinc-600`
- Accent (amber): `bg-amber-500`, `text-amber-400`
- Success (green): `text-green-500`, `bg-green-500`

**Common patterns:**
- Container: `bg-zinc-900 rounded-lg p-4 border border-zinc-700`
- Interactive: `hover:bg-zinc-700 cursor-pointer`
- Selected: `ring-2 ring-amber-500`
- Disabled: `opacity-50 cursor-not-allowed`
- Focus: `focus:ring-2 focus:ring-amber-500/30 focus:outline-none`
- Spacing: `p-4`, `gap-3`, `gap-4`
- Corners: `rounded-lg`

**Grid layouts:**
```typescript
grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3
```

## Key Files by Task

| Task | Key Files |
|------|-----------|
| Add UI section | Create `src/routes/builder/{section}.tsx`, update `PageTabs.tsx` |
| Add feature UI state | Create `src/stores/{feature}UIStore.ts` |
| Add reusable component | `src/components/ui/` |

## Misc

- Do not use useMemo unless absolutely necessary