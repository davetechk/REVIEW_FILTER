// tracker.js — records page visits to site_visits table
// Works as both ES module import and standalone script

(async () => {
  try {
    const SUPABASE_URL     = 'https://mvmqrrwqnvwyajgynjul.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bXFycndxbnZ3eWFqZ3luanVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MjEzMzQsImV4cCI6MjA5MDk5NzMzNH0.Cp77f9Uez8fn60n2tMigfEmE--cnmJPxZqD-NBGty60';

    await fetch(`${SUPABASE_URL}/rest/v1/site_visits`, {
      method: 'POST',
      headers: {
        'apikey':        SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({
        page:       window.location.pathname,
        user_agent: navigator.userAgent,
      }),
    });
  } catch (_) {
    // fail silently — never break the page
  }
})();
