import winston, { format } from "winston";
import expressWinston from "express-winston";

/**
 * Creating a custom log format, eg. [21:43:16] INFO: POST /api/auth/login 400 9ms
 */
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
  }),
);

/**
 * Creating express logger
 */
export const expressLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: LOG_FORMAT,
  meta: false,
  metaField: null,
  expressFormat: true,
  colorize: false,
});
