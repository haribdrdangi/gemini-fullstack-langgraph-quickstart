import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming cn is available

export function LoadingBubble() {
  const dotVariants = {
    animate: (i: number) => ({
      y: [0, -6, 0], // Bouncing effect
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <motion.div
      className={cn(
        "flex items-end gap-3 justify-start animate-fadeInUpSmooth mb-4", // Mimic MessageBubble alignment for AI, added mb-4 & animation class
      )}
      initial={{ opacity: 0, y: 20 }} // animate-fadeInUpSmooth might make this redundant, but keep for safety
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div
        className={cn(
          "relative break-words flex flex-row items-center space-x-1.5 rounded-xl min-h-7 max-w-fit p-3 px-4 shadow-sm", // Adjusted padding
          "bg-card text-card-foreground" // Ensured consistent AI bubble style
        )}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-muted-foreground/70 rounded-full" // Adjusted size and color
            variants={dotVariants}
            animate="animate"
            custom={i}
          />
        ))}
      </div>
    </motion.div>
  );
}
