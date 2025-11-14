
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50" data-testid="home-container">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center border border-gray-100" data-testid="home-card">
        <h1 className="text-3xl font-bold text-green-600 mb-4" data-testid="home-heading">Welcome to NutriApp!</h1>
        <p className="mb-4 text-gray-700" data-testid="home-description">You can log in with the test user:</p>
        <div className="bg-gray-100 rounded-lg p-4 mb-4 text-left" data-testid="test-credentials">
          <p data-testid="test-email"><span className="font-semibold">Email:</span> <span className="font-mono" data-testid="test-email-value">test@nutriapp.com</span></p>
          <p data-testid="test-password"><span className="font-semibold">Password:</span> <span className="font-mono" data-testid="test-password-value">nutriapp123</span></p>
        </div>
        <a href="/login" className="inline-block bg-green-500 text-white py-2 px-6 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow focus:outline-none focus:ring-2 focus:ring-green-300" data-testid="home-login-button">Go to Login</a>
      </div>
    </main>
  );
}
