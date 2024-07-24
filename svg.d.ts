import type React from 'react';

declare global {
  module '*.svg' {
    const component: React.FC<React.SVGProps<SVGSVGElement>>;
    export default component;
  }
}
