import { ResponseType } from '@/types/parliamentaryQuestions.types';

export const RESPONSE_TYPES: ResponseType[] = [
  {
    key: 'suresiIcindeCevaplanan',
    label: 'Süresi İçinde Cevaplanan',
    shortLabel: 'Zamanında',
    color: '#4CAF50',
  },
  {
    key: 'suresiGectiktenSonraCevaplanan',
    label: 'Süresi Geçtikten Sonra Cevaplanan',
    shortLabel: 'Gecikmeli',
    color: '#FF9800',
  },
  {
    key: 'cevaplanmadigiGelenKagitlardaIlanEdilen',
    label: 'Cevaplanmadığı Gelen Kağıtlarda İlan Edilen',
    shortLabel: 'Cevaplanmadı',
    color: '#F44336',
  },
  {
    key: 'cevaplanmaSuresiDevamEden',
    label: 'Cevaplanma Süresi Devam Eden',
    shortLabel: 'Devam Ediyor',
    color: '#2196F3',
  },
  {
    key: 'geriAlinan',
    label: 'Geri Alınan',
    shortLabel: 'Geri Alındı',
    color: '#9E9E9E',
  },
]; 