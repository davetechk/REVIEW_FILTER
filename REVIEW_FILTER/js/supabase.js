import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://mvmqrrwqnvwyajgynjul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bXFycndxbnZ3eWFqZ3luanVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MjEzMzQsImV4cCI6MjA5MDk5NzMzNH0.Cp77f9Uez8fn60n2tMigfEmE--cnmJPxZqD-NBGty60';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
