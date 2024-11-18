import { Injectable } from '@nestjs/common';
import { tokenizeText } from './utils/tokenizer.util.js';
import { validateText } from './utils/validation.util.js';
import { generatePDF } from './utils/pdfGenerator.util.js';

@Injectable()
export class TokenService {
  async processText(text: string) {
    console.log('🚀 ~ TokenService ~ processText ~ text:', text);
    const validation = validateText(text);

    // Improved validation and error throwing with detailed error message
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const tokens = tokenizeText(text);
    console.log('🚀 ~ TokenService ~ processText ~ text:', text);
    const { fileName, filePath, count } = await generatePDF(text);

    return { fileName, filePath, count, tokens };
  }
}
