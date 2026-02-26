import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Card className="w-full max-w-md p-6">
        <div className="text-lg font-semibold text-white">Page not found</div>
        <div className="mt-1 text-sm text-white/60">The page you requested doesn’t exist.</div>
        <div className="mt-4">
          <Link to="/">
            <Button variant="primary">Go to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

