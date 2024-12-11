import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export function ErrorScreen() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Oops!</h1>
          <h2 className="text-2xl mb-4">{error.status === 404 ? 'Page Not Found' : 'Something went wrong'}</h2>
          <p className="text-gray-600 mb-6">
            {error.status === 404
              ? "The page you're looking for doesn't exist."
              : error.data?.message || 'An unexpected error occurred.'}
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Unexpected Error</h1>
        <p className="text-gray-600 mb-6">Something went wrong. Please try again later.</p>
        <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go Back Home
        </a>
      </div>
    </div>
  );
}
