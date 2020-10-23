import { resetProperties } from '../common_modules/resetServerProperties.mjs';

export const call = ['stop'];

export function exec(serverProperties) {
	resetProperties(serverProperties);
}