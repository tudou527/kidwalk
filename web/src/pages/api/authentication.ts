import type { NextApiRequest, NextApiResponse } from 'next';
import { createSRPServer } from '@swan-io/srp';
import { createSigner, createVerifier } from 'fast-jwt';

const secretKey = 'Uhb7^cH#A1j6G8cWc^%';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const server = createSRPServer("SHA-256", 2048);
  const method = req.method?.toLowerCase();

  const salt = '5b28e5d74fddf99776947bbcaa7e9c485c6e4a734c084f94d1b50f1ec80fc3de';
  const verifier = '6a977667bdac126828b64e4bca5b40f0e2f76adc305fc3e378d843b5c98da7973b4d0c61bf984fedd8c2cbdd27c70fa95eeef417bcbafebb58e5f5fc9d8564d7584e79eb81a78951258b384c06369e8b5dc55a801bf1a582b5453e8e91af8ce8daed365a2e6cc1a77ff26ab25fd5e06f65324d8b2c7050553b65acb743ce0883e3c8cc27c6880b4511c4de6fbb3bb41ead971f70cb464e591623ecbae8b1fa80b4610e1c184876403e927d5f49444cec0348ed2d345a9dda0152e6cff6ae8d0ba081e26d7c17084c644248329ca3fa178da6c600a1be661588c2d2b1a7c4432b0be648245d500a4362effc4cb5c390eac3d370421b95f7cd11a8d4c41194df0a';

  if (method === 'post') {
    const { action, username, token, clientEphemeralPublic, clientSessionProof } = req.body;

    if (action === 'ephemeral') {
      const serverEphemeral = await server.generateEphemeral(verifier);
      const signSync = createSigner({ key: secretKey });
      const jwtToken = signSync({ secret: serverEphemeral.secret, expiresIn: 30 });

      return res.status(200).json({
        salt,
        token: jwtToken,
        public: serverEphemeral.public,
      });
    }

    if (action === 'session') {
      try {
        const verifySync = createVerifier({ key: secretKey });
        const payload = verifySync(token);
        console.log('>>>>> payload: ', payload);

        const serverSession = await server.deriveSession(
          payload.secret,
          clientEphemeralPublic,
          salt,
          username,
          verifier,
          clientSessionProof,
        );

        return res.status(200).json(serverSession);
      } catch(error) {
        console.log('>>>>> error: ', error);

        return res.status(200).json({
          data: false,
        });
      }
    }
  }


  res.status(200).json({ name: "John Doe" });
}