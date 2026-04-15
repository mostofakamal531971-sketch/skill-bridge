import { httpRequest } from "@/config/axios/axios";

type AIMode = "blog" | "template" | "resume" | "review" | "search" | "chat";

interface GeneratePayload {
  mode: AIMode;
  context?: Record<string, any>;
  data?: Record<string, any>;
}

export const generateAIContent = async (payload: GeneratePayload) => {
  try {
    const res = await httpRequest.post("/api/generative-ai/generate", payload);
    return {
      success: true,
      data: res.data.output,
    };
  } catch (error: any) {
    console.error("AI Generation Error:", error?.response?.data || error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to generate AI content",
    };
  }
};

