import React, { useState, useEffect } from "react";
import { updateUser } from "../../services/authService";
import { ProfileModalProps, FormData } from "../../types";

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<FormData>({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
    });

    useEffect(() => {
        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const updatedUser = await updateUser(formData);
            onUpdate(updatedUser);
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl mb-4">Update Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium"
                            htmlFor="firstName"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium"
                            htmlFor="lastName"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
