import { keyframes, styled } from 'stitches.config';

const shimmer = keyframes({
  '100%': { transform: 'translateX(100%)' },
});

export const Button = styled('button', {
  position: 'relative',
  overflow: 'hidden',

  textAlign: 'center',
  width: '$full',
  marginTop: '20px',
  border: 'none',
  outline: 'none',
  color: 'white',
  fontFamily: '$serif',
  fontSize: '18px',
  cursor: 'pointer',
  backgroundColor: 'hsl(203, 18%, 19%)',
  textDecoration: 'none',
  padding: '10px 20px',
  borderRadius: '5px',

  '&[disabled]': {
    opacity: '50%',
    cursor: 'not-allowed',
  },

  variants: {
    loading: {
      true: {
        '&::after': {
          position: 'absolute',
          inset: 0,
          transform: 'translateX(-100%)',
          background:
            'linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0))',
          animation: `${shimmer} 5s infinite`,
          content: '',
        },
      },
    },
  },
});
