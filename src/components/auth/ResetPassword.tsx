import { useState } from "react";
import { resetPassword } from "../../services/authService";
import { ResetPasswordProps } from "../../types";


export default function ResetPassword({ token, onSuccess }: ResetPasswordProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            return setError("Passwords don't match");
        }

        try {
            setLoading(true);
            await resetPassword(token, newPassword);
            setSuccess("Password reset successfully!");
            setTimeout(() => onSuccess(), 2000);
        } catch (err: any) {
            setError(err.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Reset Password</h1>

            {error && (
                <div className="p-2 text-sm text-red-600 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {success ? (
                <div className="p-2 text-sm text-green-600 bg-green-100 rounded-lg">
                    {success}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md text-white ${
                            loading
                                ? "bg-gray-400"
                                : "bg-green-400 hover:bg-green-500"
                        }`}
                    >
                        {loading ? "Processing..." : "Reset Password"}
                    </button>
                </form>
            )}
        </div>
    );
}
