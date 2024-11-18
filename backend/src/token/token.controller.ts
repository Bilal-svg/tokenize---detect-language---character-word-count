import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  Get,
  Param,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { TokenService } from './token.service.js';
import { Response } from 'express';
import path from 'path';
import * as fs from 'fs';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('process')
  async processText(@Body() body: { text: string }, @Res() res: Response) {
    try {
      const { text } = body;
      const { filePath, count, tokens } =
        await this.tokenService.processText(text);
      return res.status(HttpStatus.OK).json({ filePath, count, tokens });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint to serve the PDF file for download

  @Get('download/:fileName')
  @Header('Content-Type', 'application/pdf')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async downloadPDF(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      // Ensure the filename is valid and construct the file path
      const filePath = path.join(
        process.cwd(),
        'public',
        'pdfs',
        fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
      );

      console.log('🚀 Constructed file path:', filePath);

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        console.log('🚀 File does not exist at:', filePath);
        return res.status(404).send('File not found');
      }

      // Stream the file to the response
      const file = fs.createReadStream(filePath);

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${path.basename(filePath)}"`,
      );
      file.pipe(res);
    } catch (error) {
      console.error('🚀 Error during file download:', error);
      res.status(500).send('Error while downloading the file');
    }
  }
}
