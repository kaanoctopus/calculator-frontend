import { useState, useEffect } from "react";
import { registerUser } from "../../services/authService";
import { RegisterProps, RegisterFormData, RegisterErrors } from "../../types";

const INPUTBOX_CSS: string =
    "w-full p-2 mt-1 border rounded-lg focus:ring-primary-600 focus:border-primary-600";

export default function Register({ onSwitchToLogin }: RegisterProps) {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<RegisterErrors>({});
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
                onSwitchToLogin();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, onSwitchToLogin]);

    const validateForm = (): boolean => {
        const newErrors: RegisterErrors = {};

        if (!formData.firstName.trim())
            newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
            newErrors.lastName = "Last name is required";

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name as keyof RegisterErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            await registerUser(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password
            );

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            setSuccessMessage(
                "Account created successfully! Redirecting to login..."
            );
        } catch (err: any) {
            if (err.message.includes("already exists")) {
                setErrors({ email: "Email is already registered" });
            } else {
                setErrors({ general: err.message });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-white md:mt-0 sm:max-w-md xl:p-0 rounded-3xl">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Create an account
                </h1>

                {errors.general && (
                    <div className="m-auto w-40 text-red-600 bg-red-100 p-2 rounded-md">
                        {errors.general}
                    </div>
                )}

                {successMessage && (
                    <div className="m-auto w-40 text-green-600 bg-green-100 p-2 rounded-md">
                        {successMessage}
                    </div>
                )}

                <form
                    className="space-y-3 md:space-y-4"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            First Name
                            {errors.firstName && (
                                <span className="text-red-500 text-xs ml-1">
                                    ({errors.firstName})
                                </span>
                            )}
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            placeholder="John"
                            onChange={handleChange}
                            className={`${INPUTBOX_CSS} ${
                                errors.firstName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Last Name
                            {errors.lastName && (
                                <span className="text-red-500 text-xs ml-1">
                                    ({errors.lastName})
                                </span>
                            )}
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            placeholder="Doe"
                            onChange={handleChange}
                            className={`${INPUTBOX_CSS} ${
                                errors.lastName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Email
                            {errors.email && (
                                <span className="text-red-500 text-xs ml-1">
                                    ({errors.email})
                                </span>
                            )}
                        </label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={formData.email}
                            placeholder="name@company.com"
                            onChange={handleChange}
                            className={`${INPUTBOX_CSS} ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Password
                            {errors.password && (
                                <span className="text-red-500 text-xs ml-1">
                                    ({errors.password})
                                </span>
                            )}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            autoComplete="off"
                            placeholder="••••••••"
                            onChange={handleChange}
                            className={`${INPUTBOX_CSS} ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Confirm Password
                            {errors.confirmPassword && (
                                <span className="text-red-500 text-xs ml-1">
                                    ({errors.confirmPassword})
                                </span>
                            )}
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="••••••••"
                            onChange={handleChange}
                            autoComplete="off"
                            className={`${INPUTBOX_CSS} ${
                                errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300"
                        }`}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center h-5">
                                <div role="status">
                                    <svg
                                        aria-hidden="true"
                                        className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-green-400"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            "Create an account"
                        )}
                    </button>
                </form>

                <div className="text-sm text-center">
                    <span>Already have an account? </span>
                    <button
                        onClick={onSwitchToLogin}
                        className="font-medium text-green-400 hover:underline"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}
