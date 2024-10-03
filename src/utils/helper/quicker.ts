import os from 'os';
import { ServerConfig } from '../../config';
import bcrypt from 'bcrypt';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getTimezonesForCountry } from 'countries-and-timezones';
import { randomInt } from 'crypto';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import jwt from 'jsonwebtoken';

dayjs.extend(utc);

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

    public static async comparePassword(
        attemptedPassword: string,
        hashedPassword: string,
    ) {
        return await bcrypt.compare(attemptedPassword, hashedPassword);
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

    public static generateRandomOTP(length: number) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return randomInt(min, max).toString();
    }

    public static generateRandomTokenId() {
        return uuid();
    }

    public static generateAccountConfirmationExpiry(minute: number) {
        return dayjs().valueOf() + minute * 60 * 1000;
    }

    public static generateRefreshTokenExpiry(days: number) {
        return dayjs().valueOf() + days * 1000;
    }

    public static getCurrentTimeStamp() {
        return dayjs().valueOf();
    }

    public static getCurrentDateAndTime() {
        return dayjs().utc().toDate();
    }

    public static generateToken(
        payload: object,
        secret: string,
        expiry: number,
    ) {
        return jwt.sign(payload, secret, {
            expiresIn: expiry,
        });
    }

    public static getDomainFromUrl(url: string) {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
    }
}

export default Quicker;
