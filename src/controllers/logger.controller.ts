import winston, { format } from "winston";
import expressWinston from "express-winston";

const LOG_FORMAT = winston.format.combine(
	format.timestamp({ format: "HH:mm:ss" }),
	format.splat(),
	format.errors({ stack: true }),
	format.printf((info) => {
		let { timestamp, level, message, stack, ...rest } = info;
		level = level.toUpperCase();
		let metadata = JSON.stringify(rest, undefined, 2);
		metadata = metadata === "{}" ? "" : "\n" + metadata;
		const log = `[${timestamp}] ${level}: ${message.trim()} ${metadata}`;
		return stack ? `${log}\n${stack}` : log;
	})
);

export const expressLogger = expressWinston.logger({
	transports: [new winston.transports.Console()],
	format: LOG_FORMAT,
	meta: false,
	metaField: null,
	expressFormat: true,
	colorize: false,
});
