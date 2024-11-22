export interface ICapturePaymentRequestBody {
    provider: string;
}

export interface IVerifyPaymentRequestBody {
    provider: string;
    orderId: string;
    paymentId: string;
    signature: string;
}
