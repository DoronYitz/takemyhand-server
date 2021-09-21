import winston, { format } from "winston";
import expressWinston from "express-winston";

const LOG_FORMAT = winston.format.combine(
	format.align(),
	format.timestamp({ format: "HH:mm:ss" }),
	format.printf(({ level, message, timestamp, label }) => {
		return `${timestamp} | ${level.toLowerCase()} | ${message.trim()}`;
	})
);

export const expressLogger = expressWinston.logger({
	transports: [new winston.transports.Console()],
	format: LOG_FORMAT,
	meta: false,
	expressFormat: true,
	colorize: false,
});
