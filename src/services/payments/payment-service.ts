import { StatusCodes } from 'http-status-codes';
import { CourseRepository, PaymentRepository, UserRepository } from '../../repositories';
import { Enums, ResponseMessage } from '../../utils/constants';
import { AppError } from '../../utils/error';
import { IPaymentGateway, IVerifyPaymentParams } from './gateways';
import PaymentGatewayFactory from './payment-gateway-factory';
import { Quicker } from '../../utils/helper';
import CourseProgressService from '../course-progress-service';

class PaymentService {
    private courseRepository: CourseRepository;
    private userRepository: UserRepository;
    private courseProgressService: CourseProgressService;
    private paymentRepository: PaymentRepository;

    constructor() {
        this.courseRepository = new CourseRepository();
        this.userRepository = new UserRepository();
        this.courseProgressService = new CourseProgressService();
        this.paymentRepository = new PaymentRepository();
    }

    public async capture(provider: 'stripe' | 'razorpay', data: { courseIds: number[]; userId: number }) {
        const paymentGateway: IPaymentGateway = PaymentGatewayFactory.getPaymentGateway(provider);
        try {
            // * destructure data
            const { courseIds, userId } = data;

            // * check course exists
            const courses = await this.courseRepository.getAll({ where: { id: courseIds } });

            if (courses.length !== courseIds.length) {
                throw new AppError(ResponseMessage.NOT_FOUND('Some Courses'), StatusCodes.NOT_FOUND);
            }

            // * check user exists
            const user = await this.userRepository.getOneById(userId);
            if (!user) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * Check user already enrolled
            const alreadyEnrolled = [];
            for (const course of courses) {
                const isEnrolled = await course.hasStudent(user);
                if (isEnrolled) {
                    alreadyEnrolled.push(course);
                }
            }
            if (alreadyEnrolled.length > 0) {
                throw new AppError(ResponseMessage.USER_ALREADY_ENROLLED, StatusCodes.BAD_REQUEST);
            }

            // * calculate the total Amount
            const totalAmount = courses.reduce((sum, course) => sum + course.price, 0);

            const paymentResponse = await paymentGateway.createOrder(
                totalAmount,
                'INR',
                `receipt_${Quicker.getRandomNumber(8)}`,
                {
                    email: user.email,
                },
            );

            if (paymentResponse) {
                const payment = await this.paymentRepository.create({
                    provider,
                    amount: totalAmount,
                    currency: paymentResponse.currency,
                    orderId: paymentResponse.id,
                    status: Enums.EPaymentStatus.PENDING,
                    userId,
                });

                for (const course of courses) {
                    await payment.addCourse(course);
                }
            }

            return paymentResponse;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.FAILED('Payment Capturing'), StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async verify(
        provider: string,
        paymentResponse: IVerifyPaymentParams,
        data: { courseIds: number[]; userId: number },
    ) {
        const paymentGateway: IPaymentGateway = PaymentGatewayFactory.getPaymentGateway(provider);
        try {
            // * destructure the data
            const { courseIds, userId } = data;

            // * check course exists
            const courses = await this.courseRepository.getAll({ where: { id: courseIds } });
            if (courses.length !== courseIds.length) {
                throw new AppError(ResponseMessage.NOT_FOUND('Some Course'), StatusCodes.NOT_FOUND);
            }

            // * check user exists
            const user = await this.userRepository.getOneById(userId);
            if (!user) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * verify payment
            const isVerified = await paymentGateway.verifyPayment(paymentResponse);

            // *fetch the payment record
            const payment = await this.paymentRepository.getOne({ where: { orderId: paymentResponse.orderId } });

            if (!payment) {
                throw new AppError(ResponseMessage.NOT_FOUND('Payment Record'), StatusCodes.NOT_FOUND);
            }

            // * check payment verified
            if (!isVerified) {
                // * Make the payments failed in the database
                await this.paymentRepository.update(payment.id, {
                    status: Enums.EPaymentStatus.FAILED,
                    paymentId: paymentResponse.paymentId,
                });

                throw new AppError(ResponseMessage.PAYMENT_VERIFICATION_FAILED, StatusCodes.UNAUTHORIZED);
            }

            // * make the payment succeeded in the db record
            await this.paymentRepository.update(payment.id, {
                status: Enums.EPaymentStatus.SUCCEEDED,
                paymentId: paymentResponse.paymentId,
            });

            // * enroll the user
            // const transaction = await this.courseRepository.startTransaction();
            // try {
            for (const course of courses) {
                if (!(await course.hasStudent(user))) {
                    await course.addStudent(user);
                    await this.courseProgressService.create(course.id, user.id, null);
                }
            }
            // await transaction.commit();
            // } catch (error) {
            //     await transaction.rollback();
            //     throw error;
            // }

            // * send payment successful email
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.FAILED('Payment Verification'), StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
export default PaymentService;
