import Card from './Card'

interface CardData {
    id: number
    title: string
    description: string
    image: string
    tags: string[]
    link: string
    button: string,
    type: string
}

interface CardListProps {
    cards: CardData[]
}

const CardList = ({ cards }: CardListProps) => {
    return (
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-8 px-4'>
            {cards.map((card) => (
                <div key={card.id} className={`${card.type === 'mini' ? 'col-span-1' : 'sm:col-span-2'}`}>
                    <Card {...card} />
                </div>
            ))}
        </div>
    )
}

export default CardList 