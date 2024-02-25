import { z } from "zod";

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

export const ResponseCodes = ['INVALID_INPUT', 'DONE', 'EMPTY_INPUT', 'ERROR', 'DATABASE_QUERY_ERROR', 'FORBIDDEN'] as const;

export const DefaultTRPCResponseSchema = z.object({
	error: z.boolean(),
	code: z.enum(ResponseCodes),
	message: z.string().optional(),
	data: z.any()
})

export const Regex = {
	username: /^[a-zA-Z0-9._]+$/
}

export const PusherChannelNames = ["NOTIFICATION"] as const;

export const Icons = {
	Plus: 'tabler:plus',
	Mail: 'tabler:mail',
	Twitter: 'ri:twitter-x-fill',
	Info: 'ph:info',
	Dices: 'lucide:dices',
	Triangle: 'tabler:triangle',
	TriangleError: 'bx:error',
	AtSign: 'carbon:at',
	BadgeCheck: 'iconoir:badge-check',
	Bell: 'ph:bell',
	UserSearch: 'lucide:user-round-search',
	MessageCircle: 'lucide:message-circle',
	Friends: 'ic:outline-people',
	ArrowLeft: 'ph:arrow-left',
	HeartHandshake: 'lucide:heart-handshake'
}

// how many rejected friend requests there should be before not allowing user to send another friend request
export const FriendRequestRejectedRequestsCountThreshold = 2;
// how much time should have been passed before sending another friend request, this only applies if there are "FriendRequestRejectedRequestsCountThreshold" number of rejected friend requests.
export const FriendRequestRejectedRequestsTimePeriodInMinutesThreshold = 60 * 24 // 1 Day;