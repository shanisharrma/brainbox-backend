import { createLogger, format, transports } from 'winston';
import util from 'util';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';
import { Enums } from '../constants';
import { ServerConfig } from '../../config';
import path from 'path';
import { red, blue, yellow, green, magenta } from 'colorette';
import * as sourceMapSupport from 'source-map-support';
import SequelizeTransport from '../sequelize-transport';

// Linking Trace Support
sourceMapSupport.install();

const colorizeLevel = (level: string) => {
    switch (level) {
        case 'ERROR':
            return red(level);
        case 'INFO':
            return blue(level);
        case 'WARN':
            return yellow(level);
        default:
            return level;
    }
};

const consoleLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;

    const customLevel = colorizeLevel(level.toUpperCase());
    const customTimestamp = green(String(timestamp));
    const customMessage = message;
    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
    });
    const customLog = `${customLevel} [${customTimestamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`;
    return customLog;
});

const consoleTransport = (): Array<ConsoleTransportInstance> => {
    if (ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), consoleLogFormat),
            }),
        ];
    }
    return [];
};

const fileLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;
    const logMeta: Record<string, unknown> = {};
    if (typeof meta === 'object' && meta !== null) {
        for (const [key, value] of Object.entries(meta)) {
            if (value instanceof Error) {
                logMeta[key] = {
                    name: value.name,
                    message: value.message,
                    trace: value.stack || '',
                };
            } else {
                logMeta[key] = value;
            }
        }
    }
    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta: logMeta,
    };
    return JSON.stringify(logData, null, 4);
});
const FileTransport = (): Array<FileTransportInstance> => {
    return [
        new transports.File({
            filename: path.join(__dirname, '../', '../', '../', 'logs', `${ServerConfig.ENV}.log`),
            level: 'info',
            format: format.combine(format.timestamp(), fileLogFormat),
        }),
    ];
};

// Custom Sequelize transport for logging into the database
const sequelizeTransport = (): SequelizeTransport[] => {
    return [
        new SequelizeTransport({
            level: 'info', // Set logging level for Sequelize transport.
        }),
    ];
};

export default createLogger({
    defaultMeta: {
        meta: {},
    },
    transports: [...FileTransport(), ...consoleTransport(), ...sequelizeTransport()],
});
