import jwksClient from "jwks-rsa";

const { JWKS_URI } = process.env;

//const client = jwksClient({ jwksUri: String(JWKS_URI) });

export const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(err, signingKey);
  });
};
