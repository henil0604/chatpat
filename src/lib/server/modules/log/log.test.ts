import { describe, it, expect } from 'vitest';
import { LogType, logger } from './index';

describe('log module', () => {
	it('simple hello world log', () => {
		const log = logger().type(LogType.OK);
		expect(log.getInfo().type).toBe(LogType.OK);
		log.message('Hello World');
		expect(log.getInfo().message[0]).toBe('Hello World');
	});

	it('with prefix', () => {
		const log = logger().type(LogType.OK).message('Hello World');
		log.prefix('server');
		expect(log.getInfo().prefixes[0]).toBe('server');
	});

	it('with callback', () => {
		const log = logger().type(LogType.OK).message('Hello World');
		log.on('commit', () => { });
		expect(log.getInfo().listeners[0].event).toBe('commit');
		expect(log.getInfo().listeners[1]).toBeUndefined();
	});
});
