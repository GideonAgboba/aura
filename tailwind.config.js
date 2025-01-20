/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        primary: '#F55064',
        'tasks-completed': '#4CAF50',
        'mood-score': '#2196F3',
        chart: {
          line: '#3b82f6',
          axis: '#94a3b8',
          rules: '#e2e8f0',
          text: '#64748b',
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
