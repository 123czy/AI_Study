import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RequirePage from "./require"
import InfoPage from "./info"
import QuestionPage from "./question"
const CompanyPage = () => {
    return <div className="container mx-auto py-20  h-screen  flex flex-col items-center">
    <Tabs defaultValue="require" className="w-90vw md:w-[600px] sm:w-[400px]">
        <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="require">招聘要求</TabsTrigger>
            <TabsTrigger value="info">公司介绍</TabsTrigger>
            <TabsTrigger value="question">上传题库</TabsTrigger>
        </TabsList>
        <TabsContent value="require">
            <RequirePage/>
        </TabsContent>
        <TabsContent value="info">
            <InfoPage/>
        </TabsContent>
        <TabsContent value="question">
            <QuestionPage/>
        </TabsContent>
    </Tabs>
</div>
}

export default CompanyPage