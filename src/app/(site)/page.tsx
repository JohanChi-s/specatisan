import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <main className="flex flex-col">
      <section className="bg-gray-100 dark:bg-gray-900 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Take Notes with Ease
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Streamline your note-taking with our powerful, cloud-synced app.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Sign Up
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Download App
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Powerful Features for Better Note-Taking
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Streamline your workflow with our suite of productivity tools.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <CloudIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                Cloud Sync
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access your notes from any device with our secure cloud sync.
              </p>
            </div>
            <div className="space-y-4">
              <MergeIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Invite team members to collaborate on notes in real-time.
              </p>
            </div>
            <div className="space-y-4">
              <GroupIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                Organization
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep your notes organized with tags, folders, and search.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-100 dark:bg-gray-900 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Ready to Take Notes Smarter?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Sign up or download our app to start organizing your thoughts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="#"
            >
              Sign Up
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              href="#"
            >
              Download App
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

function CloudIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function GroupIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5c0-1.1.9-2 2-2h2" />
      <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
      <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
      <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
      <rect width="7" height="5" x="7" y="7" rx="1" />
      <rect width="7" height="5" x="10" y="12" rx="1" />
    </svg>
  );
}

function MergeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 6 4-4 4 4" />
      <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
      <path d="m20 22-5-5" />
    </svg>
  );
}
