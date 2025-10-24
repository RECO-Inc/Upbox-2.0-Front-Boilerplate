/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontSize: {
  			'size-9': ['var(--text-size-9)', { lineHeight: 'var(--text-size-9--line-height)' }],
  			'size-10': ['var(--text-size-10)', { lineHeight: 'var(--text-size-10--line-height)' }],
  			'size-11': ['var(--text-size-11)', { lineHeight: 'var(--text-size-11--line-height)' }],
  			'size-12': ['var(--text-size-12)', { lineHeight: 'var(--text-size-12--line-height)' }],
  			'size-13': ['var(--text-size-13)', { lineHeight: 'var(--text-size-13--line-height)' }],
  			'size-14': ['var(--text-size-14)', { lineHeight: 'var(--text-size-14--line-height)' }],
  			'size-15': ['var(--text-size-15)', { lineHeight: 'var(--text-size-15--line-height)' }],
  			'size-16': ['var(--text-size-16)', { lineHeight: 'var(--text-size-16--line-height)' }],
  			'size-18': ['var(--text-size-18)', { lineHeight: 'var(--text-size-18--line-height)' }],
  			'size-20': ['var(--text-size-20)', { lineHeight: 'var(--text-size-20--line-height)' }],
  			'size-22': ['var(--text-size-22)', { lineHeight: 'var(--text-size-22--line-height)' }],
  			'size-24': ['var(--text-size-24)', { lineHeight: 'var(--text-size-24--line-height)' }],
  			'size-28': ['var(--text-size-28)', { lineHeight: 'var(--text-size-28--line-height)' }],
  			'size-32': ['var(--text-size-32)', { lineHeight: 'var(--text-size-32--line-height)' }]
  		},
  		fontWeight: {
  			thin: 'var(--font-weight-thin)',
  			extralight: 'var(--font-weight-extralight)',
  			light: 'var(--font-weight-light)',
  			normal: 'var(--font-weight-normal)',
  			medium: 'var(--font-weight-medium)',
  			semibold: 'var(--font-weight-semibold)',
  			bold: 'var(--font-weight-bold)',
  			extrabold: 'var(--font-weight-extrabold)',
  			black: 'var(--font-weight-black)'
  		},
  		colors: {
  			base: {
  				10: 'var(--color-base-10)',
  				20: 'var(--color-base-20)',
  				30: 'var(--color-base-30)',
  				40: 'var(--color-base-40)',
  				50: 'var(--color-base-50)',
  				60: 'var(--color-base-60)',
  				70: 'var(--color-base-70)',
  				80: 'var(--color-base-80)',
  				90: 'var(--color-base-90)',
  				100: 'var(--color-base-100)'
  			},
  			primary: {
  				20: 'var(--color-primary-20)',
  				30: 'var(--color-primary-30)',
  				40: 'var(--color-primary-40)',
  				50: 'var(--color-primary-50)',
  				60: 'var(--color-primary-60)',
  				70: 'var(--color-primary-70)',
  				80: 'var(--color-primary-80)',
  				90: 'var(--color-primary-90)',
  				100: 'var(--color-primary-100)'
  			},
  			info: {
  				20: 'var(--color-info-20)',
  				30: 'var(--color-info-30)',
  				40: 'var(--color-info-40)',
  				50: 'var(--color-info-50)',
  				60: 'var(--color-info-60)',
  				70: 'var(--color-info-70)',
  				80: 'var(--color-info-80)',
  				90: 'var(--color-info-90)',
  				100: 'var(--color-info-100)'
  			},
  			positive: {
  				20: 'var(--color-positive-20)',
  				30: 'var(--color-positive-30)',
  				40: 'var(--color-positive-40)',
  				50: 'var(--color-positive-50)',
  				60: 'var(--color-positive-60)',
  				70: 'var(--color-positive-70)',
  				80: 'var(--color-positive-80)',
  				90: 'var(--color-positive-90)',
  				100: 'var(--color-positive-100)'
  			},
  			error: {
  				20: 'var(--color-error-20)',
  				30: 'var(--color-error-30)',
  				40: 'var(--color-error-40)',
  				50: 'var(--color-error-50)',
  				60: 'var(--color-error-60)',
  				70: 'var(--color-error-70)',
  				80: 'var(--color-error-80)',
  				90: 'var(--color-error-90)',
  				100: 'var(--color-error-100)'
  			},
  			warning: {
  				20: 'var(--color-warning-20)',
  				30: 'var(--color-warning-30)',
  				40: 'var(--color-warning-40)',
  				50: 'var(--color-warning-50)',
  				60: 'var(--color-warning-60)',
  				70: 'var(--color-warning-70)',
  				80: 'var(--color-warning-80)',
  				90: 'var(--color-warning-90)',
  				100: 'var(--color-warning-100)'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--reka-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--reka-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
