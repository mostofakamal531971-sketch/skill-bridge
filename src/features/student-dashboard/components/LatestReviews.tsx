import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

const LatestReviews = async() => {

    await new Promise((res)=> setTimeout(res,2000))
  return (
       <Card className="lg:col-span-3 shadow-sm border-zinc-200/60 dark:border-zinc-800/60">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" /> Latest Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Alex Rivera</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">"Great teacher! Explained state management perfectly."</p>
            </div>
            <Button variant="outline" className="w-full group" asChild>
              <Link href="/tutors">
                Book Again <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
  )
}

export default LatestReviews
