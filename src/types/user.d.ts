export type ProfileModalProps = {
    user: User;
    onClose: () => void;
    onUpdate: (updatedUser: User) => void;
};

export type FormData = {
    firstName: string;
    lastName: string;
};

export type ProfileData = {
    firstName: string;
    lastName: string;
    email: string;
};

export type UserProfileProps = {
    profileData: ProfileData | null;
    onGetProfile: () => void;
    onUpdateProfile: () => void;
    onLogout: () => void;
    onDeleteAccount: () => void;
};
