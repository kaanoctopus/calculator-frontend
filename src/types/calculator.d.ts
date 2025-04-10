import { UserProfileProps } from "./user";

export type CalculatorInterfaceProps = {
    history: string[];
    result: string;
    expression: string;
    handleKeyPress: (key: string) => Promise<void>;
    handleClearHistory: () => Promise<void>;
    onLogout: () => void;
    profileData: UserProfileProps["profileData"];
    onGetProfile: () => void;
    onDeleteAccount: () => void;
    onUpdateProfile: () => void;
};
