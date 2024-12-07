import Razorpay from 'razorpay';
import {
    ICreateOrderResponse,
    IPaymentGateway,
    IPaymentNotesData,
    IRefundResponse,
    IVerifyPaymentParams,
} from './payment-gateway-interface';
import { ServerConfig } from '../../../config';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import { AppError } from '../../../utils/error';
import { ResponseMessage } from '../../../utils/constants';

class RazorpayPaymentService implements IPaymentGateway {
    private razorpayInstance: Razorpay;

    constructor() {
        this.razorpayInstance = new Razorpay({
            key_id: ServerConfig.RAZORPAY.KEY_ID as string,
            key_secret: ServerConfig.RAZORPAY.KEY_SECRET as string,
        });
    }

    public async createOrder(
        amount: number,
        currency: string,
        receipt: string,
        notesData: IPaymentNotesData,
    ): Promise<ICreateOrderResponse> {
        try {
            const orderOptions = {
                amount: Math.round(amount * 100),
                currency,
                receipt,
                payment_capture: 1,
                notes: { email: notesData.email },
            };

            const order = await this.razorpayInstance.orders.create(orderOptions);

            return {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                status: order.status,
                clientSecret: null,
            };
        } catch (error) {
            throw new AppError(ResponseMessage.FAILED_TO_MAKE_PAYMENT, StatusCodes.PAYMENT_REQUIRED, error);
        }
    }

    public async verifyPayment(paymentResponse: IVerifyPaymentParams): Promise<boolean> {
        try {
            // * destructure the payment response
            const { paymentId, orderId, signature } = paymentResponse;

            // * get the razorpay secret key
            const razorpaySecretKey = ServerConfig.RAZORPAY.KEY_SECRET as string;

            // * prepare body for generating signature
            const body = orderId + '|' + paymentId;

            // * generate signature
            const generatedSignature = crypto.createHmac('sha256', razorpaySecretKey).update(body).digest('hex');

            // * verify the signatures
            return generatedSignature === signature;
        } catch (error) {
            throw new AppError(ResponseMessage.FAILED_TO_VERIFY_PAYMENT, StatusCodes.PAYMENT_REQUIRED, error);
        }
    }

    public async refundPayment(paymentId: string, amount?: number): Promise<IRefundResponse> {
        try {
            const refund = await this.razorpayInstance.payments.refund(paymentId, {
                amount: amount ? amount * 100 : undefined,
            });

            return {
                id: refund.id,
                amount: refund.amount,
                status: refund.status,
            };
        } catch (error) {
            throw new AppError(ResponseMessage.FAILED_TO_REFUND_PAYMENT, StatusCodes.PAYMENT_REQUIRED, error);
        }
    }
}

export default RazorpayPaymentService;
