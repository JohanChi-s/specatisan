import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";

// Define types for context value
interface AisContextType {
  message: string | null;
  onSetMessage: (msg: string) => void;
}

// Create context with initial values
export const AisContext = createContext<AisContextType>({
  message: null,
  onSetMessage: () => {},
});

// Define props interface for AisProvider
interface AisProviderProps {
  children: ReactNode;
  initialMessage?: string | null;
}

// AisProvider component
export const AisProvider: React.FC<AisProviderProps> = ({
  children,
  initialMessage,
}) => {
  const [message, setMessage] = useState<string | null>(initialMessage || null);

  const handleSetMessage = useCallback((msg: string) => {
    setMessage((currentMsg) => {
      if (currentMsg !== msg) {
        return msg;
      } else {
        return null; // Clear the message if it's already set
      }
    });
  }, []);

  const providerValue: AisContextType = {
    message,
    onSetMessage: handleSetMessage,
  };

  return (
    <AisContext.Provider value={providerValue}>{children}</AisContext.Provider>
  );
};

// useAisState hook
export const useAisState = (): AisContextType => {
  const context = useContext(AisContext);
  if (!context) {
    throw new Error("useAisState must be used within an AisProvider");
  }
  return context;
};
