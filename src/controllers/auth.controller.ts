import { Request, Response } from "express";
import * as Yup from "yup";
import { ObjectId } from "mongoose";

import { User } from "../models/user.model";
import { IRequestWithUser } from "../middlewares/auth.middleware";
import { login, register, me, updateProfile } from "../services/auth.service";

const registerSchema = Yup.object().shape({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string()
        .required()
        .oneOf([Yup.ref("password")], "The password confirmation does not match"),
    roles: Yup.array().of(Yup.string()).optional(),
});

const loginSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
});

type TLoginBody = Yup.InferType<typeof loginSchema>;
type TRegisterBody = Yup.InferType<typeof registerSchema>;

interface IRequestLogin extends Request {
    body: TLoginBody;
}

interface IRequestRegister extends Request {
    body: TRegisterBody;
}

export default {
    async login(req: IRequestLogin, res: Response) {
        try {
            const { email, password } = req.body;

            await loginSchema.validate({ email, password });

            const token = await login({ email, password });

            res.status(200).json({ message: "login success", data: token });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                res.status(422).json({ message: error.errors[0], data: null });
            } else {
                const err = error as Error;
                res.status(500).json({ message: err.message, data: null });
            }
        }
    },
    async register(req: IRequestRegister, res: Response) {
        try {
            const { email, fullName, password, username, confirmPassword, roles } = req.body;

            await registerSchema.validate({ email, fullName, password, username, confirmPassword, roles });

            const user = await register({ email, fullName, username, password, roles });

            res.status(200).json({ message: "registration success!", data: user });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                res.status(422).json({ message: error.errors[0], data: null });
            } else {
                const err = error as Error;
                res.status(500).json({ message: err.message, data: null });
            }
        }
    },
    async me(req: IRequestWithUser, res: Response) {
        try {
            const id = req.user?.id;

            if (id === undefined) return res.status(404).json({ message: "user not found", data: null });

            const user = await me(id.toString());

            if (!user) return res.status(404).json({ message: "user not found", data: null });

            res.status(200).json({ message: "success fetch user profile", data: user });
        } catch (error) {
            const err = error as Error;

            res.status(500).json({ data: err.message, message: "Failed get user profile" });
        }
    },
    async updateProfile(req: IRequestWithUser, res: Response) {
        try {
            const id = req.user?.id;
            const result = await updateProfile(id as unknown as ObjectId, req.body as User);

            res.status(200).json({ message: "Profile updated successfully", data: result });
        } catch (error) {
            const err = error as Error;

            res.status(500).json({ data: err.message, message: "Failed update user profile" });
        }
    },
};
