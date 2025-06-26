interface Prompt {
  system: string
  prompt: string
}

export const prompt: Prompt = {
  system: `
  你是一个专业的简历分析专家。你的任务是分析输入的简历内容，并生成一个结构化的 JSON 格式总结。
  你必须严格按照指定的 JSON 格式输出，不要添加任何额外的说明文字。
  所有字段如果在简历中未提及，使用 null 值。
  `,
  prompt: `
  请分析以下简历内容，并生成一个结构化的 JSON 格式总结：

  简历内容：{content}

  请严格按照以下 JSON 格式输出（不要包含任何其他文字）：
  {
    "name": string | null,        // 候选人姓名
    "phone": string | null,       // 候选人电话
    "email": string | null,       // 候选人邮箱
    "education": {
      "school": string | null,    // 学校名称
      "degree": string | null,    // 学位
      "major": string | null,     // 专业
      "graduationYear": number | null  // 毕业年份
    },
    "workExperience": [
      {
        "company": string | null,     // 公司名称
        "position": string | null,    // 职位
        "startDate": string | null,   // 开始时间 (YYYY-MM 格式)
        "endDate": string | null,     // 结束时间 (YYYY-MM 格式)
        "description": string | null  // 工作描述
      }
    ],
    "projects": [
      {
        "name": string | null,        // 项目名称
        "role": string | null,        // 担任角色
        "startDate": string | null,   // 开始时间 (YYYY-MM 格式)
        "endDate": string | null,     // 结束时间 (YYYY-MM 格式)
        "description": string | null, // 项目描述
        "technologies": string[] | null // 使用的技术栈
      }
    ],
    "skills": {
      "programming": string[] | null,  // 编程语言技能
      "frameworks": string[] | null,   // 框架技能
      "languages": string[] | null,    // 语言技能
      "others": string[] | null        // 其他技能
    }
  }
  `,
}
