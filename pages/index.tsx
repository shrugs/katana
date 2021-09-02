import { Paragraph, Title } from '@app/components/Typography';
import { Button } from '@app/components/Button';
import { Box } from '@app/components/Box';
import Link from 'next/link';

const IndexPage = () => {
  return (
    <Box
      css={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: '$4',
      }}
    >
      <Box css={{ col: true, sy: '$8' }}>
        <Title css={{ textAlign: 'center' }}>Katana Garden</Title>
        <Paragraph css={{ color: 'gray', textAlign: 'center' }}>
          This website is an easy way to create token-gated communities. Very much alpha.
        </Paragraph>
        <Paragraph css={{ color: 'gray', textAlign: 'center' }}>
          Join one of the communities below 👇
        </Paragraph>
      </Box>

      <Box css={{ col: true, sy: '$2' }}>
        <Link href="/katana" passHref>
          <Button as="a">Join the Katana Garden Discord</Button>
        </Link>
        {/* <Link href="/lootwars" passHref>
          <Button as="a">Join the Loot Wars Discord</Button>
        </Link> */}
      </Box>
    </Box>
  );
};

export default IndexPage;
