import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import type { AI } from "../lib/chat/actions";
import { ButtonScrollToBottom } from "./button-scroll-to-bottom";
import { PromptForm } from "./prompt-form";
import { UserMessage } from "./stocks/message";

export interface ChatPanelProps {
  id?: string;
  title?: string;
  input: string;
  setInput: (value: string) => void;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
}: ChatPanelProps) {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const exampleMessages = [
    {
      heading: "Thank my interviewer",
      subheading: "Help me write letter thank my interviewer?",
      message: `Help me write letter thank my interviewer?`,
    },
    {
      heading: "Quiz me on",
      subheading: "Quiz me on ancient civilizations?",
      message:
        "Can you test my knowledge on ancient civilizations by asking me specific questions? Start by asking me which civilization I'm most interested in and why.",
    },
    {
      heading: "Make me a personal website",
      subheading: "Make me a personal website",
      message: `Create a personal webpage for me, all in a single file. Ask me 3 questions first on whatever you need to know.`,
    },
    {
      heading: "Email Write",
      subheading: `Email for plumber quote`,
      message: `Write an email to request a quote from local plumbers for backflow testing. I need it done in the next 2 weeks. Keep it short and casual.`,
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && "hidden md:block"
                }`}
                onClick={async () => {
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>,
                    },
                  ]);

                  const responseMessage = await submitUserMessage(
                    example.message
                  );

                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ]);
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
        </div>
      </div>
    </div>
  );
}
