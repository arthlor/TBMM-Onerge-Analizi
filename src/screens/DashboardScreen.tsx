import React, { useEffect } from 'react';
import { useParliamentaryQuestionsStore } from '@/store/parliamentaryQuestionsStore';
import { parliamentaryQuestionsData } from '@/data/parliamentaryQuestionsData';
import DetailedDataTable from '@/components/DetailedDataTable';
import InteractiveCharts from '@/components/InteractiveCharts';
import DataSummary from '@/components/DataSummary';
import PoliticalPartyAnalysis from '@/components/PoliticalPartyAnalysis';
import './DashboardScreen.css';

const DashboardScreen: React.FC = () => {
  const setData = useParliamentaryQuestionsStore((state) => state.setData);

  useEffect(() => {
    setData(parliamentaryQuestionsData.tableData);
  }, [setData]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <div className="hero-background">
          <img src="/assets/hero.webp" alt="TBMM Hero" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="header-content">
            <h1 className="dashboard-title">Meclis Karnesi</h1>
            <p className="dashboard-subtitle">
              28. Yasama Döneminde (21.07.2025 tarihi itibarıyla) TBMM Başkanlığınca işleme alınan yazılı soru önergelerinin muhataplarına, partilerin verdikleri önergelere ve önergelerin son durumuna göre dağılımlarını içeren interaktif projemiz. Veriler, TBMM Başkanlığına verdiğimiz önergeye verilen cevaplardan hazırlanmıştır.
            </p>
            <div className="dashboard-meta">
              <span className="meta-item">
                <strong>Hazırlayan:</strong> CHP İçişlerinden Sorumlu Genel Başkan Yardımcısı Murat BAKAN
              </span>
              <span className="meta-item">
                <strong>Tarih:</strong> {parliamentaryQuestionsData.documentInfo.dateAsOf}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* Data Summary */}
        <section className="dashboard-section">
          <DataSummary />
        </section>

        {/* Interactive Charts */}
        <section className="dashboard-section">
          <h2 className="section-title">İnteraktif Grafikler</h2>
          <InteractiveCharts />
        </section>

        {/* Detailed Data Table */}
        <section className="dashboard-section">
          <h2 className="section-title">Detaylı Veri Tablosu</h2>
          <DetailedDataTable />
        </section>

        {/* Political Party Analysis - Moved to Bottom */}
        <section className="dashboard-section">
          <PoliticalPartyAnalysis />
        </section>
      </div>
    </div>
  );
};

export default DashboardScreen; 