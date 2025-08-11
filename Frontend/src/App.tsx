import { useState } from 'react'
import { LoginForm } from './components/login-form'
import { SignupForm } from './components/signup-form'
import { Button } from './components/ui/button'

function App() {
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={!showSignup ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowSignup(false)}
              className="rounded-md"
            >
              Login
            </Button>
            <Button
              variant={showSignup ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowSignup(true)}
              className="rounded-md"
            >
              Sign Up
            </Button>
          </div>
        </div>
        {showSignup ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  )
}

export default App
