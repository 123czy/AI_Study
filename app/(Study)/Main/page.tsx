import { ModalExample } from '@/Study/components/ModalExample'
import MainPage from '@/Study/components/MainPage'
import CardList from '@/Study/components/CardList'
import mock from './mock.json'



const MainStudy = () => {
  return (
    <main className='flex min-h-screen max-h-screen overflow-y-scroll overflow-x-hidden'>
    <div className='container mx-auto py-6 xl:px-8 lg:px-6 md:px-4'>
      <MainPage />
      <CardList cards={mock.main} />  
    </div>
    </main>
  )
}

export default MainStudy