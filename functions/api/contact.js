export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DISCORD_WEBHOOK_URL) {
    return new Response(JSON.stringify({ error: 'Server not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = String(body.name || '').slice(0, 200);
  const email = String(body.email || '').slice(0, 200);
  const message = String(body.message || '').slice(0, 2000);
  const referredBy = String(body.referredBy || '').slice(0, 100);

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const fields = [
    { name: 'Name', value: name, inline: true },
    { name: 'Email', value: email, inline: true },
    { name: 'Message', value: message },
  ];
  if (referredBy) fields.push({ name: 'Referred by', value: referredBy, inline: true });

  const discordMessage = {
    embeds: [{
      title: 'New Contact Form Submission',
      color: 16760576,
      fields,
      footer: { text: 'Portfolio Terminal Contact Form' },
      timestamp: new Date().toISOString(),
    }],
  };

  const discordRes = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discordMessage),
  });

  if (!discordRes.ok) {
    return new Response(JSON.stringify({ error: 'Failed to deliver message' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
