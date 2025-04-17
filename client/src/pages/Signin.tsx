import { ArrowRight, Lock, Mail } from "lucide-react";
import FormInput from "../components/FormInput";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SuccessToast from "../components/Toasts/SuccessToast";
import { z } from "zod";
import ErrorToast from "../components/Toasts/ErrorToast";

interface Credentials {
    email: string;
    password: string;
}

const Signin: React.FC = () => {
    const { isAuthenticated, user, signin, authError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            SuccessToast(`Logged in as ${user?.name}`);
            navigate("/");
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (authError) {
            ErrorToast(authError);
        }
    }, [authError]);

    const [credentials, setCredentials] = useState<Credentials>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>();

    const allowedEmailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

    const validationSchema = z.object({
        email: z
            .string({ message: "Email should be a valid string" })
            .email({ message: "Please enter a valid email address" })
            .refine(
                (email) => {
                    const domain = email.split("@")[1];
                    return allowedEmailDomains.includes(domain);
                },
                { message: "Email provider not supported" }
            ),
        password: z
            .string({ message: "Password should be a valid string" })
            .min(8, { message: "Password must be at least 8 characters long" }),
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationResult = validationSchema.safeParse(credentials);
        if (!validationResult.success) {
            setErrors(validationResult.error.flatten().fieldErrors);
            return;
        }
        await signin(credentials);
    };

    return (
        <div className="flex h-svh w-svw flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div>
                    <label htmlFor="email">Email</label>
                    <FormInput
                        id="email"
                        Icon={Mail}
                        type="text"
                        value={credentials.email}
                        onChange={handleChange}
                        name="email"
                    />
                    {errors?.email ? <span className="text-red-800">{errors?.email[0]}</span> : <span></span>}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <FormInput
                        id="password"
                        Icon={Lock}
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        name="password"
                    />
                    {errors?.password ? <span className="text-red-800">{errors?.password[0]}</span> : <span></span>}
                </div>
                <div className="mt-2 w-full">
                    <Button type="submit" style="primary" text="Signin" Icon={ArrowRight} />
                </div>
            </form>
        </div>
    );
};

export default Signin;
