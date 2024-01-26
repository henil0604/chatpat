export const AUTH_BASE_URL = '/auth';
export const AUTH_OAUTH_BASE_URL = `${AUTH_BASE_URL}`;

export const AUTH_ENABLED_METHODS = ['github', 'google'] as const;

export const SOCIAL_TWITTER_HANDLE = 'TeamChatpat';
export const SOCIAL_TWITTER_LINK = `https://twitter.com/${SOCIAL_TWITTER_HANDLE}`;

export const SOCIAL_EMAIL = 'chatpat@henil.xyz';

export const Pages: {
	[key: string]: {
		path: string;
		secure?: boolean;
	};
} = {
	Application: {
		path: '/app',
		secure: true
	},
	SignIn: {
		path: '/auth/signin'
	},
	OnBoarding: {
		path: '/onboard',
		secure: true
	}
};
