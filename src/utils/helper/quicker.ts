import os from 'os';
import { ServerConfig } from '../../config';
import bcrypt from 'bcrypt';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getTimezonesForCountry } from 'countries-and-timezones';

class Quicker {
    public static getSystemHealth() {
        return {
            cpuUsage: os.loadavg(),
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
        };
    }

    public static getApplicationHealth() {
        return {
            environment: ServerConfig.ENV,
            uptime: `${process.uptime().toFixed(2)} seconds`,
            memoryUsage: {
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            },
        };
    }

    public static async hashPassword(password: string) {
        return await bcrypt.hash(password, ServerConfig.SALT_ROUNDS);
    }

    public static parsePhoneNumber(phoneNumber: string) {
        const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

        if (!parsedPhoneNumber) {
            return {
                countryCode: null,
                isoCode: null,
                internationalNumber: null,
            };
        }

        return {
            countryCode: parsedPhoneNumber.countryCallingCode,
            isoCode: parsedPhoneNumber.country || null,
            internationalNumber: parsedPhoneNumber.formatInternational(),
        };
    }

    public static getCountryTimezone(isoCode: string) {
        return getTimezonesForCountry(isoCode);
    }
}

export default Quicker;
