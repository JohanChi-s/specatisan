/**
 * v0 by Vercel.
 * @see https://v0.dev/t/BPtEQa6b4HI
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";

export default function AcessDeny() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="max-w-md p-6 rounded-lg shadow-lg bg-card">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-card-foreground">
            Access Restricted
          </h1>
          <p className="text-muted-foreground">
            You do not currently have permission to access the requested assets.
            Please contact your administrator or team lead to request access.
          </p>
          <div className="flex justify-end gap-2">
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Request Access
            </Link>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
