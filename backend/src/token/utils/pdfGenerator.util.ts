import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

// Helper function to detect if the text contains Japanese or Chinese characters
const containsAsianCharacters = (text: string): boolean => {
  return /[\u4e00-\u9faf\u3040-\u30ff\u31f0-\u31ff]/.test(text); // Matches Chinese and Japanese characters
};

// Helper function to count words in a given text
const countWords = (text: string): number => {
  return text.split(/\s+/).length;
};

// Helper function to count characters (for Chinese or Japanese text)
const countCharacters = (text: string): number => {
  return text.replace(/\s+/g, '').length; // Removes spaces and counts the remaining characters
};

// Helper function to split text into non-Japanese/Chinese and Japanese/Chinese parts
const splitTextByLanguage = (
  text: string,
): { nonAsianText: string; asianText: string } => {
  const nonAsianText = text.replace(
    /[\u4e00-\u9faf\u3040-\u30ff\u31f0-\u31ff]/g,
    '',
  ); // Remove all Asian characters
  const asianText = text.replace(
    /[^ \u4e00-\u9faf\u3040-\u30ff\u31f0-\u31ff]/g,
    '',
  ); // Remove all non-Asian characters
  return { nonAsianText, asianText };
};

export const generatePDF = async (
  text: string,
): Promise<{ filePath: string; fileName: string; count: number }> => {
  try {
    if (typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Input text is invalid or empty');
    }

    const outputDir = path.join(process.cwd(), 'public', 'pdfs');

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `text_${Date.now()}.pdf`;
    const filePath = path.resolve(outputDir, fileName);

    // Split the text into non-Asian and Asian parts
    const { nonAsianText, asianText } = splitTextByLanguage(text);

    // Count words in non-Asian text and characters in Asian text
    const wordCount = countWords(nonAsianText);
    const charCount = containsAsianCharacters(asianText)
      ? countCharacters(asianText)
      : 0;

    const totalCount = wordCount + charCount;

    // Launch Puppeteer to generate the PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Format the entire text
    const formattedText = `
      <div class="content">
        <p>${text}</p>
        <p style="font-weight: bold; margin-top: 20px;">Word Count: ${totalCount}</p>
      </div>
    `;

    await page.setContent(`
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              font-size: 16px;
              margin: 30px;
              line-height: 1.6;
              color: #007bff;
            }
            h1, h2, h3, h4 {
              color: #0056b3;
            }
            p {
              margin-bottom: 15px;
            }
            .content {
              padding: 10px;
              border: 1px solid #eee;
              background-color: #fafafa;
              border-radius: 5px;
            }
            .footer {
              position: fixed;
              bottom: 30px;
              left: 0;
              right: 0;
              text-align: center;
              font-size: 10px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          ${formattedText}
          <div class="footer">
            Generated by Puppeteer
          </div>
        </body>
      </html>
    `);

    console.log('File Path before PDF generation:', filePath);
    if (typeof filePath !== 'string' || filePath.trim().length === 0) {
      throw new Error(`Invalid file path: ${filePath}`);
    }

    // Generate PDF
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return { fileName, filePath, count: totalCount };
  } catch (error) {
    console.error('Error during PDF generation:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
