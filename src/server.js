import express from "express";
import zkFetchClient from '@zkpass/zkfetch';
import cors from "cors";

const app = express();
import 'dotenv/config';

const PORT = process.env.PORT || 3003;
const appid = process.env.ZKPASS_APP_ID;
const path = process.env.WEBHOOK;

app.use(express.json());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Health Check Route
app.get("/express/status", (req, res) => {
  res.json({
    status: "OK",
    message: "API is running  hello🚀",
    timestamp: Date.now(),
  });
});



// Your zkpass route
app.get("/express/zkpass/:address", async (req, res) => {
  const { address } = req.params;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }
  try {
   
    const client = new zkFetchClient({ appId: appid });
    const response = await client.fetchData({
      request: {
       // url: `https://backend.zkpass.org/users/level/airdrop?address=${address}`,
       url:path+address,
        method: "GET",
        headers: { accept: "application/json" },

      },
      asserts: {
      
        response: [
            {
            key: "dob",
            operation: ">",
            value: "18"
          },
           {
            key:"isMale",
             isPublic:true,


          },
          
           {
            key: "verification_status",
            operation: "=",
            value: "valid",
            tips:"valid KYC",
          },
            {
            key: "expiry_date",
            isPublic:true,
          },
          {
            key: "country",
            isPublic:true,
          },
        
        ],
      },
    });

    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export the app for Vercel serverless functions
export default app;

