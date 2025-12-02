import express from "express";
import { supabaseAdmin } from "../lib/supabase.js"; 
import { kycaidFetch } from "../lib/kyc.js"; 

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // 1. Get all applicants
    const { data: applicants, error } = await supabaseAdmin
      .from("encrypted_proofs")
      .select("Applicant_id, email");

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    if (!applicants || applicants.length === 0) {
      return res.json({ success: false, error: "No applicants found" });
    }

    // 2. Loop through applicants
    for (const applicant of applicants) {
      try {
        // Fetch KYC info
        const r = await kycaidFetch(`/applicants/${applicant.Applicant_id}`, {
          method: "GET",
        });

        const json = await r.json();
        console.log("Documents:", json.documents);

        if (json.status === "completed") {
          console.log("Applicant completed KYC:", applicant.email);

          // Example: fetch your zkPass data
          // const zk = await fetch("url...", {...});
          // const zkJson = await zk.json();

          // Optional: store results
          // await supabaseAdmin
          //   .from("zkpass_results")
          //   .insert({
          //     applicant_id: applicant.Applicant_id,
          //     data: zkJson,
          //   });
        }
      } catch (err) {
        console.error("Error processing applicant:", applicant.email, err);
      }
    }

    return res.json({ success: true });

  } catch (err) {
    console.error("General error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
