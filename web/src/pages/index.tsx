import { createSRPClient } from '@swan-io/srp';
import { useEffect } from 'react';

const username = 'linus@folkdatorn.s';
const password = '$uper$ecur';

export default function Home() {

  const init = async () => {
    const client = createSRPClient('SHA-256', 2048);
    // const defaultSalt = client.generateSalt();
    // const privateDefaultKey = await client.derivePrivateKey(defaultSalt, username, password);
    // const verifier = client.deriveVerifier(privateDefaultKey);
    // console.log('>>>>> salt: ', defaultSalt);
    // console.log('>>>>> verifier: ', verifier);
    const clientEphemeral = client.generateEphemeral();

    const serverEphemeralResponse = await fetch('/api/authentication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'ephemeral', username }),
    }).then(res => res.json());
    console.log('>>>>> serverEphemeralResponse: ', serverEphemeralResponse);

    const privateKey = await client.derivePrivateKey(serverEphemeralResponse.salt, username, password);
    const clientSession = await client.deriveSession(
      clientEphemeral.secret,
      serverEphemeralResponse.public,
      serverEphemeralResponse.salt,
      username,
      privateKey,
    );
    const serverSessionResponse = await fetch('/api/authentication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'session',
        username,
        clientEphemeralPublic: clientEphemeral.public,
        clientSessionProof: clientSession.proof,
        token: serverEphemeralResponse.token,
      }),
    }).then(res => res.json());

    const clientVerify = await client.verifySession(
      clientEphemeral.public,
      clientSession,
      serverSessionResponse.proof,
    );

    console.log('>>>>> clientVerify: ', clientVerify);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
    </div>
  );
}
