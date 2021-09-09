import { Box } from '@elements/Box';
import { Button } from '@elements/Button';
import { Paragraph } from '@elements/Typography';
import { signIn, useSession } from 'next-auth/client';

export default function SignInWidget({
  fulfilled,
  loading,
}: {
  fulfilled: boolean;
  loading: boolean;
}) {
  if (fulfilled) {
    return (
      <Paragraph css={{ color: '$gray', textAlign: 'center' }}>
        Logged into Katana Garden 👍
      </Paragraph>
    );
  }

  return (
    <Box css={{ col: true, sy: '$2' }}>
      {/* <Button wide loading={loading} disabled={loading}>
        Log In With Email
      </Button> */}
      <Button
        onClick={() => signIn('discord')}
        variant="discord"
        wide
        loading={loading}
        disabled={loading}
      >
        Log In With Discord
      </Button>
    </Box>
  );
}
