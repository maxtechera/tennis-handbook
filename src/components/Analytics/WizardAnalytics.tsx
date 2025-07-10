import React, { useEffect, useState } from 'react';
import styles from './WizardAnalytics.module.css';

interface FunnelData {
  starts: number;
  emails: number;
  completes: number;
  downloads: number;
}

interface ConversionRates {
  emailCapture: string;
  completion: string;
  pdfDownload: string;
}

interface AnalyticsData {
  period: string;
  funnel: FunnelData;
  conversionRates: ConversionRates;
  segmentStats: Array<{
    user_segment: string;
    total: number;
    completed: number;
  }>;
  emailSources: Array<{
    source: string;
    count: number;
  }>;
}

export function WizardAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  const fetchAnalytics = async (days = 7) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics-wizard?days=${days}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div className={styles.loading}>Loading analytics...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!data) return null;
  
  return (
    <div className={styles.container}>
      <h2>Wizard Analytics - {data.period}</h2>
      
      <div className={styles.funnelSection}>
        <h3>Conversion Funnel</h3>
        <div className={styles.funnelStats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{data.funnel.starts}</div>
            <div className={styles.statLabel}>Starts</div>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{data.funnel.emails}</div>
            <div className={styles.statLabel}>Emails</div>
            <div className={styles.conversion}>{data.conversionRates.emailCapture}%</div>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{data.funnel.completes}</div>
            <div className={styles.statLabel}>Completes</div>
            <div className={styles.conversion}>{data.conversionRates.completion}%</div>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{data.funnel.downloads}</div>
            <div className={styles.statLabel}>Downloads</div>
            <div className={styles.conversion}>{data.conversionRates.pdfDownload}%</div>
          </div>
        </div>
      </div>
      
      <div className={styles.segmentSection}>
        <h3>Completion by Segment</h3>
        <div className={styles.segments}>
          {data.segmentStats.map(segment => (
            <div key={segment.user_segment} className={styles.segment}>
              <div className={styles.segmentName}>{segment.user_segment}</div>
              <div className={styles.segmentStats}>
                {segment.completed}/{segment.total} completed
                ({segment.total > 0 ? ((segment.completed / segment.total) * 100).toFixed(1) : 0}%)
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.sourcesSection}>
        <h3>Email Capture Sources</h3>
        <div className={styles.sources}>
          {data.emailSources.map(source => (
            <div key={source.source} className={styles.source}>
              <span className={styles.sourceName}>{source.source}</span>
              <span className={styles.sourceCount}>{source.count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.actions}>
        <button onClick={() => fetchAnalytics(7)}>Last 7 days</button>
        <button onClick={() => fetchAnalytics(30)}>Last 30 days</button>
        <button onClick={() => fetchAnalytics(90)}>Last 90 days</button>
      </div>
    </div>
  );
}