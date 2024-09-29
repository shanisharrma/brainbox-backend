export type THttpResponse = {
    success: boolean;
    statusCode: number;
    request: {
        ip?: string | null;
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
};

export type THttpError = {
    success: boolean;
    statusCode: number;
    request: {
        ip?: string | null;
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
    trace?: object | null;
};

export interface ILogAttributes {
    id?: number;
    level: string;
    message: string;
    meta?: string;
    timestamp: Date;
    createdAt?: Date;
    deletedAt?: Date;
    updatedAt?: Date;
}
