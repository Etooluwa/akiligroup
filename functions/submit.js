export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const email = body.email;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Use the provided API key from environment variables if available, 
    // otherwise fallback to the one provided in the chat (for immediate testing).
    const apiKey = env.RESEND_API_KEY || 're_FLKDFYtd_5HfxaCjQzzMB357ZkBHCx1Y1';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Akili Group <onboarding@resend.dev>', // Resend default test domain
        to: 'info@akiligroup.ca',
        subject: 'New Multifamily Guide Lead',
        html: `<p>New lead from "Discover the Wealth Strategy" section:</p><p><strong>Email:</strong> ${email}</p>`,
      }),
    });

    const data = await resendResponse.json();

    if (resendResponse.ok) {
      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.error("Resend API Error:", data);
      return new Response(JSON.stringify({
        error: data.message || 'Failed to send email',
        details: data
      }), {
        status: resendResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Function Exception:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
