import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import { useCalculatorController } from "../controllers/useCalculatorController";


jest.mock("../controllers/useCalculatorController");

const mockUseCalculatorController =
    useCalculatorController as jest.MockedFunction<
        typeof useCalculatorController
    >;

describe("App Component", () => {
    beforeEach(() => {
        mockUseCalculatorController.mockReturnValue({
            expression: "",
            result: "",
            history: [],
            handleKeyPress: jest.fn(),
            handleClearHistory: jest.fn(),
            loadHistory: jest.fn(),
        });
    });

    it("renders loading spinner when loading", async () => {
        render(<App />);
        await waitFor(() => {
            const spinner = screen.getByRole("status");
            expect(spinner).toBeInTheDocument();
        });
    });

    it("renders login page when user is not logged in", async () => {
        render(<App />);
        await waitFor(() => {
            const loginButton = screen.getByText(/Sign in to your account/i);
            expect(loginButton).toBeInTheDocument();
        });
    });

    it("renders calculator interface when user is logged in", async () => {
        mockUseCalculatorController.mockReturnValue({
            expression: "2+2",
            result: "4",
            history: ["2+2=4"],
            handleKeyPress: jest.fn(),
            handleClearHistory: jest.fn(),
            loadHistory: jest.fn(),
        });

        jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
            if (key === "token") {
                return process.env.REACT_APP_TEST_KEY as string;
            }
            return null;
        });

        render(<App />);

        await waitFor(() => {
            const calculatorTitle = screen.getByText(/calculator/i);
            expect(calculatorTitle).toBeInTheDocument();
        });

        const display = screen.getByTestId("calculator-display");
        expect(display).toHaveTextContent("4");

        jest.spyOn(Storage.prototype, "getItem").mockRestore();
    });
});
