export class ParsedBetDto {
  event!: string;             // e.g., "Philadelphia 76ers vs Wizards"
  market!: string;            // e.g., "Moneyline"
  odds!: number;              // e.g., -225
  stake!: number;             // e.g., 2
  payout!: number;            // e.g., 3.78
  result!: 'Won' | 'Lost' | 'Pending';

  team!: string;              // e.g., "Philadelphia 76ers"
  opponent!: string;          // e.g., "Washington Wizards"
  teamScore!: number;         // e.g., 139
  opponentScore!: number;     // e.g., 134

  betId!: string;             // e.g., "01518002/00000658"
  placedAt!: string;          // ISO string
  rawText!: string;           // Full OCR text
}
