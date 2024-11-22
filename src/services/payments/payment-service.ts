import { StatusCodes } from 'http-status-codes';
import { CourseRepository, UserRepository } from '../../repositories';
import { ResponseMessage } from '../../utils/constants';
import { AppError } from '../../utils/error';
import { IPaymentGateway, IVerifyPaymentParams } from './gateways';
import PaymentGatewayFactory from './payment-gateway-factory';
import { Quicker } from '../../utils/helper';
import { ServerConfig } from '../../config';

class PaymentService {
    private courseRepository: CourseRepository;
    private userRepository: UserRepository;

    constructor() {
        this.courseRepository = new CourseRepository();
        this.userRepository = new UserRepository();
    }

    public async capture(provider: string, data: { courseId: number; userId: number }) {
        const paymentGateway: IPaymentGateway = PaymentGatewayFactory.getPaymentGateway(provider);
        try {
            // * destructure data
            const { courseId, userId } = data;

            // * check course exists
            const course = await this.courseRepository.getOneById(courseId);
            if (!courseId) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            // * check user exists
            const user = await this.userRepository.getOneById(userId);
            if (!user) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * Check user already enrolled
            const userEnrolled = await course.hasStudent(user);
            if (userEnrolled) {
                throw new AppError('User already enrolled to this course.', StatusCodes.BAD_REQUEST);
            }

            // * Initiate payment using payment gateway
            const paymentResponse = await paymentGateway.createOrder(
                course.price,
                'INR',
                `receipt_${Quicker.getRandomNumber(8)}`,
                { email: user.email, courseId: course.id },
            );

            return paymentResponse;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Payment Failed', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async verify(
        provider: string,
        paymentResponse: IVerifyPaymentParams,
        data: { courseId: number; userId: number },
    ) {
        const paymentGateway: IPaymentGateway = PaymentGatewayFactory.getPaymentGateway(provider);
        try {
            // * destructure the data
            const { courseId, userId } = data;

            // * check course exists
            const course = await this.courseRepository.getOneById(courseId);
            if (!course) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            // * check user exists
            const user = await this.userRepository.getOneById(userId);
            if (!user) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * get razorpay secret key
            const razorpaySecretKey = ServerConfig.RAZORPAY.KEY_SECRET as string;

            // * verify payment
            const isVerified = await paymentGateway.verifyPayment(paymentResponse, razorpaySecretKey);

            // * check payment verified
            if (!isVerified) {
                throw new AppError('Payment Verification failed.', StatusCodes.UNAUTHORIZED);
            }

            // * check if user already enrolled
            const hasEnrolled = await course.hasStudent(user);
            if (hasEnrolled) {
                throw new AppError('User already enrolled in this course', StatusCodes.BAD_REQUEST);
            }

            // * enroll the user
            await course.addStudent(user);

            // * send payment successful email
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Payment Failed', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
export default PaymentService;
