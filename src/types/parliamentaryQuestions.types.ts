export interface ParliamentaryQuestion {
  muhatap: string;
  toplam: number;
  geriAlinan: number;
  suresiIcindeCevaplanan: number;
  suresiGectiktenSonraCevaplanan: number;
  cevaplanmadigiGelenKagitlardaIlanEdilen: number;
  cevaplanmaSuresiDevamEden: number;
}

export interface DocumentInfo {
  organization: string;
  title: string;
  dateAsOf: string;
}

export interface ParliamentaryQuestionsData {
  documentInfo: DocumentInfo;
  tableData: ParliamentaryQuestion[];
}

export interface ResponseType {
  key: keyof Omit<ParliamentaryQuestion, 'muhatap' | 'toplam'>;
  label: string;
  color: string;
  shortLabel: string;
}

export interface MinistryPerformance {
  name: string;
  totalQuestions: number;
  timelyResponseRate: number;
  lateResponseRate: number;
  unansweredRate: number;
  inProgressRate: number;
  withdrawnRate: number;
  performanceScore: number;
} 