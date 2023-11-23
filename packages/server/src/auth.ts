import { verifyAndGetTokenXConfig } from "./auth-config";
import jwt from "jsonwebtoken";
import jose from "node-jose";
import { v4 as uuid } from "uuid";

type ExchangeTokenSuccess = {
  access_token: string;
  issued_token_type: string;
  token_type: string;
  expires_in: number;
};

function makeAuthHeader(response: ExchangeTokenSuccess) {
  return `${response.token_type} ${response.access_token}`;
}

const asKey = async (jwk: any) => {
  if (!jwk) {
    throw Error("JWK Mangler");
  }

  return jose.JWK.asKey(jwk);
};

async function createClientAssertion() {
  const tokenxConfig = verifyAndGetTokenXConfig();
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    sub: tokenxConfig.tokenXClientId,
    iss: tokenxConfig.tokenXClientId,
    aud: tokenxConfig.tokenXEndpoint,
    jti: uuid(),
    nbf: now,
    iat: now,
    exp: now + 60, // max 120
  };

  const key = await asKey(tokenxConfig.privateJwk);

  const options: any = {
    algorithm: "RS256",
    header: {
      kid: key.kid,
      typ: "JWT",
      alg: "RS256",
    },
  };

  return jwt.sign(payload, key.toPEM(true), options);
}

async function fetchExchange(subject_token: string) {
  const client_assertion = await createClientAssertion();
  // tokenx.prod-gcp.nav.cloud.nais.io
  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    subject_token,
    audience: "dev-gcp:min-side:tms-varsel-api",
  });

  const response = await fetch(
    `https://tokenx.dev-gcp.nav.cloud.nais.io/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      verbose: true,
    },
  );

  return response.json() as Promise<ExchangeTokenSuccess>;
}

// @TODO: Add access policy rules to tms-varsel-api
export async function exchangeToken(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Missing authorization header");
  }

  const accessToken = authHeader.replace("Bearer ", "");
  const exchanged = await fetchExchange(accessToken);
  return makeAuthHeader(exchanged);
}
