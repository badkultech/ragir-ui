import React from 'react';

interface GradientButtonIconProps {
  style?: React.CSSProperties;
  label: string;
  Icon: React.ElementType; // React component for the icon (e.g., FemaleIcon)
  Gradient: React.ElementType; // React component for the gradient background (e.g., WomenOnlyGradient)
  onClick?: () => void;
}

export const GradientIconButton = ({
  style,
  label,
  Icon,
  Gradient,
  onClick,
}: GradientButtonIconProps) => {
  return (
    <button
      style={style}
      // onClick={onClick}
      className='
        relative
        w-[220px]
        h-[60px]
        rounded-[100px]
        border-4
        overflow-hidden
        text-white
        font-semibold
        z-0
        flex
        items-center
        justify-center
        gap-2
        px-4
      '
    >
      {/* SVG Gradient Background */}
      <div className='absolute inset-0 z-0 pointer-events-none'>
        <Gradient width='100%' height='100%' />
      </div>

      {/* Icon and Label */}
      <div className='relative z-10 flex items-center gap-2'>
        <Icon fill='white' />
        <span>{label}</span>
      </div>
    </button>
  );
};
