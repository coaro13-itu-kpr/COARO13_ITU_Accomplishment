-- Create accomplishments table
create table public.accomplishments (
  id uuid default gen_random_uuid() primary key,
  staff_name text not null,
  accomplishment_date date not null,
  category text not null,
  description text not null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.accomplishments enable row level security;

-- RLS Policy: Users can view all accomplishments (for the shared log)
create policy "Anyone authenticated can view accomplishments"
  on public.accomplishments
  for select
  using (auth.role() = 'authenticated');

-- RLS Policy: Users can only insert their own accomplishments
create policy "Users can insert their own accomplishments"
  on public.accomplishments
  for insert
  with check (auth.uid() = user_id);

-- RLS Policy: Users can only update their own accomplishments
create policy "Users can update their own accomplishments"
  on public.accomplishments
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- RLS Policy: Users can only delete their own accomplishments
create policy "Users can delete their own accomplishments"
  on public.accomplishments
  for delete
  using (user_id = auth.uid());

-- Create index on date for reporting queries
create index idx_accomplishments_date on public.accomplishments(accomplishment_date);
create index idx_accomplishments_staff on public.accomplishments(staff_name);
create index idx_accomplishments_category on public.accomplishments(category);
