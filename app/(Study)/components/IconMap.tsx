import { 
    FaceIcon, 
    ImageIcon, 
    SunIcon, 
    PersonIcon, 
    ChatBubbleIcon, 
    BackpackIcon,
    LightningBoltIcon,
    GearIcon,
    KeyboardIcon
} from '@radix-ui/react-icons'

// 图标映射对象
const iconMap = {
    face: FaceIcon,
    image: ImageIcon,
    sun: SunIcon,
    person: PersonIcon,
    chat: ChatBubbleIcon,
    backpack: BackpackIcon,
    lightning: LightningBoltIcon,
    gear: GearIcon,
    keyboard: KeyboardIcon
}

// 图标组件类型
export type IconName = keyof typeof iconMap

// 图标组件属性
interface IconProps {
    name: IconName
    className?: string
}

// 动态图标组件
export const DynamicIcon = ({ name, className = "" }: IconProps) => {
    const IconComponent = iconMap[name]
    
    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`)
        return null
    }
    
    return <IconComponent className={className} />
}

export default DynamicIcon 

