export interface IPaymentGateway {
    createOrder(
        amount: number,
        currency: string,
        receipt: string,
        notesData: IPaymentNotesData,
    ): Promise<ICreateOrderResponse>;
    verifyPayment(paymentResponse: IVerifyPaymentParams): Promise<boolean>;
    refundPayment(paymentId: string, amount?: number): Promise<IRefundResponse>;
}

export interface IPaymentNotesData {
    email: string;
}

export interface ICreateOrderResponse {
    id: string;
    amount: string | number;
    currency: string;
    status: string;
    clientSecret: string | null;
}

export interface IVerifyPaymentParams {
    paymentId: string;
    orderId: string;
    signature?: string;
}

export interface IRefundResponse {
    id: string;
    amount: number | undefined;
    status: string;
}
