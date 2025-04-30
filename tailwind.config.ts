
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                // Custom portfolio colors
                dark: '#1A1F2C',
                light: '#F1F1F1',
                purple: {
                    light: '#D6BCFA',
                    DEFAULT: '#9b87f5',
                    dark: '#7E69AB',
                    vibrant: '#8B5CF6'
                },
                violet: {
                    light: '#DDD6FE',
                    DEFAULT: '#8B5CF6',
                    dark: '#7C3AED',
                    vibrant: '#6D28D9'
                },
                green: {
                    light: '#A7F3D0',
                    DEFAULT: '#10B981',
                    dark: '#059669',
                    vibrant: '#34D399'
                },
                yellow: {
                    light: '#FDE68A',
                    DEFAULT: '#FBBF24',
                    dark: '#D97706',
                    vibrant: '#F59E0B'
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.1)',
                    DEFAULT: 'rgba(255, 255, 255, 0.15)',
                    dark: 'rgba(0, 0, 0, 0.15)'
                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                // Custom animations
                'fade-in': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'float': {
                    '0%, 100%': {
                        transform: 'translateY(0px)'
                    },
                    '50%': {
                        transform: 'translateY(-20px)'
                    }
                },
                'float-delay': {
                    '0%, 100%': {
                        transform: 'translateY(0px)'
                    },
                    '50%': {
                        transform: 'translateY(-20px)'
                    }
                },
                'float-slow': {
                    '0%, 100%': {
                        transform: 'translateY(0px)'
                    },
                    '50%': {
                        transform: 'translateY(-15px)'
                    }
                },
                'rotation': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                'reverse-rotation': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(-360deg)' }
                },
                'pulse-slow': {
                    '0%, 100%': { 
                        transform: 'scale(1)',
                        opacity: '0.2'
                    },
                    '50%': { 
                        transform: 'scale(1.05)',
                        opacity: '0.3' 
                    }
                },
                'reverse-pulse': {
                    '0%, 100%': { 
                        transform: 'scale(1)',
                        opacity: '0.2'
                    },
                    '50%': { 
                        transform: 'scale(0.95)',
                        opacity: '0.3' 
                    }
                },
                'pulse-glow': {
                    '0%, 100%': { 
                        opacity: '1',
                        filter: 'brightness(1)' 
                    },
                    '50%': { 
                        opacity: '0.8',
                        filter: 'brightness(1.2)' 
                    }
                },
                'spin-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                'reverse-spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(-360deg)' }
                },
                'flip': {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(360deg)' }
                },
                'pop': {
                    '0%': { transform: 'scale(0.95)', opacity: '0.8' },
                    '50%': { transform: 'scale(1.05)', opacity: '1' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'float-delay': 'float-delay 7s ease-in-out infinite 1s',
                'float-slow': 'float-slow 8s ease-in-out infinite 2s',
                'rotation': 'rotation 20s linear infinite',
                'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
                'reverse-pulse': 'reverse-pulse 9s ease-in-out infinite 2s',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
                'spin-slow': 'spin-slow 25s linear infinite',
                'reverse-spin': 'reverse-spin 30s linear infinite',
                'flip': 'flip 2s ease-in-out',
                'pop': 'pop 0.5s ease-in-out'
			},
            fontFamily: {
                display: ['Playfair Display', 'serif'],
                body: ['Inter', 'sans-serif']
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-glass': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))'
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
