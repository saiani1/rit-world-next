/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        profileShadow: "2px 2px 4px rgba(0, 0, 0, 0.15)"
      },
      lineClamp: {
        2: "2",
        3: "3",
      },
      colors: {
        black: {
          '333': '#333',
          '444': '#444',
          '555': '#555',
          '666': '#666',
          '777': '#777',
          '888': '#888',
          '999': '#999',
          AAA: '#aaa',
          BBB: '#bbb',
          CCC: '#ccc',
          DDD: '#ddd',
          EEE: '#eee',
          FFF: '#fff',
          '50': '#ECEFF1',
          '100': '#C2C2C2',
        },
        red: {
          '50': '#FAA69B',
          '100': '#DE6757',
        },
        orange: {
          '50': '#FCCAB8',
          '100': '#E98865',
        },
        green: {
          '50': '#DAEEDC',
          '100': '#CFF4F4',
          '200': '#9CE4DF',
          '300': '#8CCA93',
          '400': '#31B8AE',
          '500': '#05AAAA',
        },
        blue: {
          '50': '#BFE2EF',
          '100': '#048ABF',
        },
        purple: {
          '50': '#EAE3F4',
          '100': '#8B77A6',
        },
      }
    },
    fontFamily: {
      Pretendard: ['Pretendard', 'sans-serif'],
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
};
