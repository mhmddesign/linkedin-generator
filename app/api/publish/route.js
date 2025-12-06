// ============================================
// IMPORTANT: Paste your n8n PUBLISH webhook URL below
// This is a SEPARATE webhook for publishing to LinkedIn
// ============================================
const N8N_PUBLISH_WEBHOOK_URL = "YOUR_PUBLISH_WEBHOOK_URL_HERE";

export async function POST(request) {
    try {
        const body = await request.json();
        const { content, accessToken } = body;

        if (!content || !content.trim()) {
            return Response.json(
                { error: "No content provided" },
                { status: 400 }
            );
        }

        if (!accessToken) {
            return Response.json(
                { error: "No access token provided. Please sign in again." },
                { status: 401 }
            );
        }

        // Send content and accessToken to n8n publish webhook
        const response = await fetch(N8N_PUBLISH_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "publish",
                content: content,
                accessToken: accessToken,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`n8n webhook error: ${response.status}`);
        }

        const data = await response.text();

        return Response.json({
            success: true,
            message: "Content sent to LinkedIn workflow",
            response: data,
        });
    } catch (error) {
        console.error("Publish error:", error);
        return Response.json(
            { error: "Failed to publish to LinkedIn. Check your webhook URL." },
            { status: 500 }
        );
    }
}
