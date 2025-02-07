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
