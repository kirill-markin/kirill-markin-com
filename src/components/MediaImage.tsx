import Image, { type ImageProps } from 'next/image';
import { resolveMediaUrl } from '@/lib/mediaUrls';

export default function MediaImage({ src, ...props }: ImageProps) {
  return <Image {...props} src={typeof src === 'string' ? resolveMediaUrl(src) : src} />;
}
