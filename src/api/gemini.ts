// src/api/gemini.ts
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel, GenerateContentRequest } from '@google/generative-ai';

@Injectable()
export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
  
    constructor() {
      this.genAI = new GoogleGenerativeAI(process.env.API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

  async generateQuestions(entries: string[]): Promise<{ question: string, correctAnswer: string }[]> {
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
          const result = await this.model.generateContent([prompt]);
          const response = await result.response;
          const text = await response.text();

        // Extracting the question
        const questionMatch = text.match(/Q:\s*([\s\S]*?)\s*\(True\/False\)/);
        if (questionMatch) {
          questions.push({
            question: questionMatch[1].trim(),
            correctAnswer: "True" // Default or based on further processing
          });
        }
      } catch (error) {
        console.error('Error generating quiz question:', error);
      }
    }

    return questions;
  }
}