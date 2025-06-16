import { InterviewTimeline } from '@/Meet/components/InterviewTimeline'
import { Button } from '@/components/ui/button'
import Link from 'next/link';

const MainPage = () => {
    return (
      <div className="container mx-auto py-20  h-screen  flex flex-col items-center">
        <h1 className="text-4xl font-bold text-primary">AI 面试官</h1>
        <Button className="mt-10 cursor-pointer bg-primary text-white hover:bg-primary/80">
          <Link href="/Meet/Interview">
            开始面试
          </Link>
        </Button>
      </div>
    );
  }
  
export default MainPage;