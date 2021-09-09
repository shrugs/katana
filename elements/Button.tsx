import { keyframes, styled } from 'stitches.config';

const shimmer = keyframes({
  '100%': { transform: 'translateX(100%)' },
});

export const Button = styled('button', {
  position: 'relative',
  overflow: 'hidden',

  textAlign: 'center',
  outline: 'none',
  fontFamily: '$sans',
  fontSize: '$lg',
  cursor: 'pointer',
  py: '$2',
  px: '$4',
  rounded: '$default',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  sx: '$2',

  '&[disabled]': {
    opacity: '50%',
    cursor: 'not-allowed',
  },

  variants: {
    variant: {
      normal: {
        backgroundColor: '$black',
        color: 'white',
      },
      discord: {
        backgroundColor: '$discord',
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
    wide: {
      true: {
        width: '$full',
      },
    },
  },

  defaultVariants: {
    variant: 'normal',
  },
});
