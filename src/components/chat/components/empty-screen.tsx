import { ExternalLink } from "../components/external-link";

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to Specatisan AI Chatbot!
        </h1>
        <p className="leading-normal text-muted-foreground">
          Feel free to ask any questions or just say hi! I am here to help you!!
        </p>
      </div>
    </div>
  );
}
