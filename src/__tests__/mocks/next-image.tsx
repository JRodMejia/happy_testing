import { vi } from 'vitest';

/**
 * Mock Next.js Image component
 */
export const NextImageMock = vi.fn(({ src, alt, ...props }) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...props} />;
});

/**
 * Setup Next Image mock
 */
export const setupNextImageMock = () => {
  vi.mock('next/image', () => ({
    default: NextImageMock,
  }));
};
