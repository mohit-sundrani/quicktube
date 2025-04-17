import { ArrowRight, Lock, Mail, User } from "lucide-react";
import FormInput from "../components/FormInput";
import { useEffect, useState } from "react";
import SuccessToast from "../components/Toasts/SuccessToast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { string, z } from "zod";
import ErrorToast from "../components/Toasts/ErrorToast";
import Button from "../components/Button";

interface Credentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Signup: React.FC = () => {
    const { isAuthenticated, user, signup, authError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            SuccessToast(`Registered as ${user?.name}`);
            navigate("/");
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (authError) {
            ErrorToast(authError);
        }
    }, [authError]);

    const [credentials, setCredentials] = useState<Credentials>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<{
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    }>();

    const allowedEmailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

    const validationSchema = z
        .object({
            name: string({ message: "Name should be valid string" }).min(3, {
                message: "Name should be at least 3 characters long",
            }),
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
            confirmPassword: z.string({ message: "Password should be a valid string" }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Password do not match",
            path: ["confirmPassword"],
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
        await signup(credentials);
    };

    return (
        <div className="flex h-svh w-svw flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div>
                    <label htmlFor="name">Name</label>
                    <FormInput
                        id="name"
                        Icon={User}
                        type="text"
                        value={credentials.name}
                        onChange={handleChange}
                        name="name"
                    />
                    {errors?.name ? <span className="text-red-800">{errors?.name[0]}</span> : <span></span>}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <FormInput
                        id="email"
                        Icon={Mail}
                        type="email"
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
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <FormInput
                        id="confirmPassword"
                        Icon={Lock}
                        type="password"
                        value={credentials.confirmPassword}
                        onChange={handleChange}
                        name="confirmPassword"
                    />
                    {errors?.confirmPassword ? (
                        <span className="text-red-800">{errors?.confirmPassword[0]}</span>
                    ) : (
                        <span></span>
                    )}
                </div>
                <div className="mt-2 w-full">
                    <Button type="submit" style="primary" text="Signin" Icon={ArrowRight} />
                </div>
            </form>
        </div>
    );
};

export default Signup;
