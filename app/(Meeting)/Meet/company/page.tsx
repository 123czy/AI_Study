'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RequirePage from "./require"
import InfoPage from "./info"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"
import { useState } from "react"
const CompanyPage = () => {
    const [isUploadSuccess, setIsUploadSuccess] = useState(false)

    const handleUploadSuccess = () => {
        setIsUploadSuccess(true)
    }

    return <div className="container mx-auto py-20  h-screen  flex flex-col items-center">
    {isUploadSuccess && (
        <Alert className="w-90vw md:w-[600px] sm:w-[400px] mb-4">
            <CheckCircle2Icon />
            <AlertTitle>成功！您的信息已保存</AlertTitle>
            <AlertDescription>
            您可以继续上传其他信息，以便我们更好地了解您。
            </AlertDescription>
        </Alert>
    )}
    <Tabs defaultValue="require" className="w-90vw md:w-[600px] sm:w-[400px]">
        <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="require">招聘要求</TabsTrigger>
            <TabsTrigger value="info">公司介绍</TabsTrigger>
        </TabsList>
        <TabsContent value="require">
            <RequirePage onUploadSuccess={handleUploadSuccess} />
        </TabsContent>
        <TabsContent value="info">
            <InfoPage/>
        </TabsContent>
    </Tabs>
</div>
}

export default CompanyPage