import { PropsWithChildren } from 'react';
import { styled } from 'stitches.config';

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '$screenh',
});

const Main = styled('main', {
  flex: 1,
  width: '$full',
  maxWidth: '$96',
  height: '$128',
  maxHeight: '100%',
  rounded: '$xl',
  shadow: '$xl',

  display: 'flex',
  flexDirection: 'row',
});

export function MainLayout({ children }: PropsWithChildren<{}>) {
  return (
    <Container>
      <Main>{children}</Main>
    </Container>
  );
}
