let lastRequestTime = 0; // Track the last request time
const requestCooldown = 5000; // 5-second cooldown to prevent spam

async function analyzeSentiment() {
    let reviewText = document.getElementById("reviewInput").value.trim();
    let resultElement = document.getElementById("sentimentResult");

    if (!reviewText) {
        resultElement.innerText = "⚠️ Please enter a review to analyze.";
        return;
    }

    const currentTime = Date.now();
    if (currentTime - lastRequestTime < requestCooldown) {
        resultElement.innerText = "⏳ Please wait before making another request.";
        return;
    }

    lastRequestTime = currentTime; // Update the last request time

    const apiKey = "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"; // Replace with your actual API key

    try {
        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: `Analyze the sentiment of this review: "${reviewText}". Respond with only Positive, Negative, or Neutral.` }],
                max_tokens: 10
            })
        });

        if (!response.ok) {
            let errorMessage = `HTTP Error: ${response.status}`;
            if (response.status === 429) {
                errorMessage += " - Too many requests, please wait.";
            }
            throw new Error(errorMessage);
        }

        let data = await response.json();
        let sentiment = data.choices?.[0]?.message?.content?.trim() || "Error in response";

        resultElement.innerText = `🔍 Sentiment: ${sentiment}`;
    } catch (error) {
        resultElement.innerText = `❌ ${error.message}`;
        console.error("API request failed:", error);
    }
}
