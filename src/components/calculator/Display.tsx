import { motion } from "framer-motion";

export default function Display({ value }: { value: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="calculator-display"
            transition={{ duration: 0.3 }}
            className="bg-black text-white text-right p-4 text-2xl rounded-t-2xl shadow-inner min-h-[60px]"
        >
            {value || "0"}
        </motion.div>
    );
}
