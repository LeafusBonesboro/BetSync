import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class SheetsService {
  private readonly logger = new Logger(SheetsService.name);
  private readonly spreadsheetId =
    '11vPD_Yoyv3Lrxyq4Y1LUvxuIJh2u28xSKJkjyCoikaY';
  private sheets;
  private auth;

  constructor() {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!raw) {
    this.logger.error('❌ Missing GOOGLE_APPLICATION_CREDENTIALS_JSON in .env');
    throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON');
  }

  // Parse and fix newline escaping in private_key
  const credentials = JSON.parse(raw);
  if (credentials.private_key?.includes('\\n')) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }

  this.auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  this.sheets = google.sheets('v4');
  this.logger.log('✅ Google Sheets client initialized with env credentials.');
}


  /** ✅ Test connection */
  async testConnection(): Promise<string> {
    const client = await this.auth.getClient();
    await this.sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId: this.spreadsheetId,
      range: 'E2',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [['✅ Sheets module connected!']] },
    });
    this.logger.log('✅ Successfully wrote test message to Google Sheet.');
    return '✅ Sheets module connected and wrote to E2';
  }

  /** 📖 Read a range */
  async read(range: string): Promise<any[][]> {
    const client = await this.auth.getClient();
    const res = await this.sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: this.spreadsheetId,
      range,
    });

    this.logger.log(`📖 Read range ${range} from Google Sheet`);
    return res.data.values || [];
  }

  /** ✏️ Update a range with new values */
  async update(range: string, values: any[][]): Promise<void> {
    const client = await this.auth.getClient();
    await this.sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    this.logger.log(`✏️ Updated range ${range} in Google Sheet.`);
  }
}
