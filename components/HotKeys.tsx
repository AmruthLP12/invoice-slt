import { useEffect } from "react";

type Shortcut = {
  keys: string[]; // Array of keys for combination like ['ctrl', 'k']
  callback: () => void; // Function to be called on key press
};

interface HotKeysProps {
  shortcuts: Shortcut[]; // Array of shortcuts
}

const HotKeys: React.FC<HotKeysProps> = ({ shortcuts }) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keysMatch = shortcut.keys.every((key) => {
          if (key === "ctrl") return e.ctrlKey;
          if (key === "shift") return e.shiftKey;
          if (key === "alt") return e.altKey;
          return key.toLowerCase() === e.key.toLowerCase();
        });

        if (keysMatch) {
          e.preventDefault(); // Prevent default action for the key press
          shortcut.callback(); // Call the associated callback function
        }
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress); // Clean up on unmount
    };
  }, [shortcuts]);

  return null; // This component doesn't render anything
};

export default HotKeys;
