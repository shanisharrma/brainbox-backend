import { AppError } from '../../utils/error';
import { IPaymentGateway, RazorpayPaymentService } from './gateways';

class PaymentGatewayFactory {
    private static gatewaysMap: { [key: string]: () => IPaymentGateway } = {
        razorpay: () => new RazorpayPaymentService(),
        // Other payment gateways
    };

    public static getPaymentGateway(provider: string): IPaymentGateway {
        const gatewayCreator = this.gatewaysMap[provider];

        if (!gatewayCreator) {
            throw new AppError(`Payment gateway provider ${provider} not supported.`);
        }

        return gatewayCreator();
    }
}

export default PaymentGatewayFactory;
