# Chat System Spec (ZE Console)

Goal: A near-perfect chat window with:
- left or right sidebar chat list (persistent)
- search across chats
- import/export chats (all or selected)
- each chat shows date/time; updates when resumed
- every paragraph/message chunk includes a timestamp
- stable performance even with long histories (no lag doom)

## Data model
### Chat
- id (uuid)
- title
- created_at (ISO)
- updated_at (ISO)  <-- updated whenever new message added
- tags[]
- pinned (bool)
- archived (bool)

### Message
- id (uuid)
- chat_id
- role: user | assistant | system | tool
- created_at (ISO)  <-- timestamp per message
- chunks[]  <-- paragraph-level timestamps

### Chunk (paragraph-level)
- id
- message_id
- created_at (ISO)  <-- REQUIRED: timestamp per paragraph
- type: text | code | image | file | system_note
- content
- meta: { token_estimate, model, cost_estimate, citations? }

## UI requirements
- Sidebar list: virtualized (no full DOM render)
- Main chat: virtualized + lazy render older messages
- Search:
  - full-text index across chunks
  - filters: date range, role, tags, has_code, has_file
- Import:
  - JSONL and ZIP (attachments)
- Export:
  - whole chat (JSONL), or bundle (ZIP)
  - include `manifest.json` with schema version

## Performance requirements
- Must render 50k+ chunks without freezing:
  - use windowed rendering (react-virtual)
  - store chunks in indexed DB or sqlite (local)
- Background indexing:
  - build search index incrementally per new chunk

## Timestamp behavior (your exact ask)
- Each paragraph is a Chunk with its own `created_at`.
- When you return days later and continue:
  - new messages get new timestamps
  - chat.updated_at refreshes
  - sidebar sorts by updated_at
  - older timestamps remain unchanged

## Integrity
- Every imported chat must be validated against schema version.
- Unknown fields preserved under `meta.extra`.

## Storage options
- Local-first: SQLite (recommended) or IndexedDB
- Sync option: push bundles to remote store (S3/R2/etc) as encrypted archives

## Minimal acceptance tests
- Import/Export roundtrip produces identical message/chunk counts
- Search returns correct results across 10k+ chats
- Scrolling performance stays responsive
