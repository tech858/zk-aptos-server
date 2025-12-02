import fetch from "node-fetch"; // only needed if Node < 18
import 'dotenv/config';

export const KYCAID = {
  BASE: process.env.KYCAID_API_BASE,
  TOKEN: process.env.KYCAID_API_TOKEN,
  FORM_ID: process.env.KYCAID_FORM_ID,
  AML_FORM_ID: process.env.KYCAID_AML_FORM_ID,
};

export async function kycaidFetch(path, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Token ${KYCAID.TOKEN}`);

  console.log("Using KYC Token:", KYCAID.TOKEN);

  return fetch(`${KYCAID.BASE}${path}`, {
    ...init,
    headers,
  });
}
