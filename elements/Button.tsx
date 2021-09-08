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
  fontFamily: '$serif',
  fontSize: '18px',
  cursor: 'pointer',
  textDecoration: 'none',
  padding: '10px 20px',
  borderRadius: '5px',

  '&[disabled]': {
    opacity: '50%',
    cursor: 'not-allowed',
  },

  variants: {
    variant: {
      normal: {
        backgroundColor: '$discord',
        color: 'white',
      },
      discord: {
        backgroundColor: 'rgb(88, 101, 242)',
        color: '$white',
      },
    },
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

  defaultVariants: {
    variant: 'normal',
  },
});
