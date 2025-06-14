import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface CardProps {
    id: number
    title: string
    description: string
    image: string
    tags: string[],
    link: string,
    button: string,
    type: string
}

const Card = ({id, title, description, image, tags, link, button, type="mini"}: CardProps) => {
  return (
    <>
    {
        type === "mini" ? (
            <div className='w-full grid grid-cols-1'>
<div className='w-full bg-white cursor-pointer rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-primary hover:scale-105 hover:transition-all'>
      <div className='p-6'>
        <h3 className='text-3xl font-bold text-primary mb-4'>{title}</h3>
        <p className=' text-accent-foreground mb-3 text-xl'>{description}</p>
        <ul className='flex flex-col gap-2 list-disc list-inside'>
          {tags.map((tag) => (
            <li
              key={tag} 
              className='px-3 py-1 text-card-foreground/60 text-lg'
            >
              {tag}
            </li>
          ))}
        </ul>
        <Link href={link}>
          <Button size='lg' className='mt-4 rounded-sm bg-primary text-primary-foreground hover:bg-primary/80'>
            {button}
          </Button>
        </Link>
      </div>
    </div>
            </div>

        ) : (
            <div className='w-full bg-white cursor-pointer rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-primary hover:scale-105 hover:transition-all'>
                <div className='p-6'>
                    <h3 className='text-3xl font-bold text-primary mb-4'>{title}</h3>
                    <p className=' text-accent-foreground mb-3 text-xl'>{description}</p>
                    <ul className='flex flex-col gap-2 list-disc list-inside'>
          {tags.map((tag) => (
            <li
              key={tag} 
              className='px-3 py-1 text-card-foreground/60 text-lg'
            >
              {tag}
            </li>
          ))}
        </ul>
        <Link href={link}>
          <Button size='lg' className='mt-4 rounded-sm bg-primary text-primary-foreground hover:bg-primary/80'>
            {button}
          </Button>
        </Link>
                </div>
            </div>
        )
    }
    </>
  ) 
}

export default Card