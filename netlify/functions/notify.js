exports.handler = async function(event) {
  console.log('notify called, method:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);
    console.log('payload url:', payload.url);
    console.log('payload title:', payload.title);

    const { url, body, title, priority, tags } = payload;

    const allowed = [
      'https://ntfy.sh/psv-calculateur-ouverture-2026',
      'https://ntfy.sh/psv-calculateur-risque-eleve-2026',
      'https://ntfy.sh/psv-calculateur-lead-2026'
    ];

    if (!allowed.includes(url)) {
      console.log('URL not allowed:', url);
      return { statusCode: 403, body: 'Forbidden' };
    }

    console.log('Calling ntfy.sh...');
    const response = await fetch(url, {
      method: 'POST',
      body: body,
      headers: {
        'Title': title,
        'Priority': priority,
        'Tags': tags
      }
    });

    console.log('ntfy response status:', response.status);
    return { statusCode: response.ok ? 200 : 502, body: response.ok ? 'OK' : 'ntfy error' };
  } catch (e) {
    console.log('Error:', e.message);
    return { statusCode: 500, body: 'Error: ' + e.message };
  }
};
