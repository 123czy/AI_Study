import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileForm from "./form"
import UploadPage from "./upload"
const InfoPage = () => {
    return (
        <div className="container mx-auto py-20  h-screen  flex flex-col items-center">
            <Tabs defaultValue="account" className="w-90vw md:w-[600px] sm:w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">上传简历</TabsTrigger>
                    <TabsTrigger value="password">手动输入</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <div className="flex flex-col ">
                        <UploadPage />
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