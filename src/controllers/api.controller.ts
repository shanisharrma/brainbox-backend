import { Request, Response } from 'express';

class ApiController {
    public static self(_: Request, res: Response) {
        res.status(200).json({ success: true, message: 'Success' });
    }
}

export default ApiController;
