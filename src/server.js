import express from "express";
import zkFetchClient from '@zkpass/zkfetch';
import cors from "cors";

const app = express();
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const appid = process.env.ZKPASS_APP_ID;
app.use(express.json());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Health Check Route
app.get("/api/status", (req, res) => {
  res.json({
    status: "OK",
    message: "API is running 🚀",
    timestamp: Date.now(),
  });
});

// Your zkpass route
app.get("/api/zkpass", async (req, res) => {
  try {
    const appid = "397e7dfb-1e93-4a0a-a0d5-dbc2d46e5659";
    const client = new zkFetchClient({ appId: appid });
    const response = await client.fetchData({
      request: {
        url: "https://backend.zkpass.org/users/level/airdrop?address=0xecd12972e428a8256c9805b708e007882568d7d6",
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
          "cache-control": "no-cache",
          origin: "https://portal.zkpass.org",
          pragma: "no-cache",
          priority: "u=1, i",
          referer: "https://portal.zkpass.org/",
          "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        },
      },
      asserts: {
        request: {
          query: [
            { key: "address", value: "0xecd12972e428a8256c9805b708e007882568d7d6" },
          ],
        },
        response: [{ key: "reward", isPublic: true }],
      },
    });

    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running at http://0.0.0.0:${PORT}`);
});

