import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileForm from "./form"
import UploadPage from "./upload"
const InfoPage = () => {
    const handleUpload = (content: string) => {
        console.log(content)
    }

    return (
        <div className="container mx-auto py-20  h-screen  flex flex-col items-center">
            <Tabs defaultValue="account" className="w-90vw md:w-[600px] sm:w-[400px] mb-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">上传简历</TabsTrigger>
                    <TabsTrigger value="password">手动输入</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <div className="flex flex-col ">
                        <UploadPage type="user"/>
                    </div>
                </TabsContent>
                <TabsContent value="password">
                    <div className="flex flex-col">
                        <ProfileForm />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default InfoPage