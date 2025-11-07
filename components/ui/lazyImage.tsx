import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const LazyImage = ({
  src,
  alt = '',
  className = '',
  width = 400,
  height = 400,
  ...rest
}: {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // When src changes, reset states and listen for load or check complete.
  useEffect(() => {
    let cancel = false;
    setLoaded(false);
    setShowSkeleton(true);

    const imgEl = imgRef.current;

    const finish = () => {
      if (cancel) return;
      // keep skeleton visible for at least 200ms so it's noticeable
      setTimeout(() => {
        if (!cancel) {
          setLoaded(true);
          setShowSkeleton(false);
        }
      }, 200);
    };

    if (imgEl && imgEl.complete) {
      // image already cached/loaded
      finish();
      return () => {
        cancel = true;
      };
    }

    const onLoad = () => finish();
    imgEl?.addEventListener('load', onLoad);

    return () => {
      cancel = true;
      imgEl?.removeEventListener('load', onLoad);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showSkeleton && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse z-0' />
      )}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        height={height}
        width={width}
        unoptimized 
        loading='lazy'
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  );
};
