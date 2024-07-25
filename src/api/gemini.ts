import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateQuestions(entries: string[]): Promise<{ question: string, correctAnswer: number }[]> {
    const questions = [];

    for (const entry of entries) {
      const prompt = `
        Based on the following diary entry, create a true/false question. 
        Diary entry: "${entry}"
        Question format:
        "Q: [Generated Question]? (True/False)"
        The question should be clear and based on the content of the diary entry.
      `;

      try {
        // GenerateContentResult의 text 속성에서 텍스트를 추출
        const result = await this.model.generateContent(prompt);
        const generatedResponse = result.response?.[0]; // Assuming the first response contains the necessary text
        const text = generatedResponse?.text || '';

        // 질문 추출
        const questionMatch = text.match(/Q:\s*([\s\S]*?)\s*\(True\/False\)/);
        if (questionMatch) {
          const correctAnswer = this.determineCorrectAnswer(text);
          questions.push({
            question: questionMatch[1].trim(),
            correctAnswer
          });
        } else {
          console.warn('No question found in the generated content.');
        }
      } catch (error) {
        console.error('Error generating quiz question:', error);
      }
    }

    return questions;
  }

  private determineCorrectAnswer(text: string): number {
    return text.includes("True") ? 1 : 0;
  }
}