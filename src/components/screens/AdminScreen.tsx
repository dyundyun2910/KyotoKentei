import React from 'react';

interface QuestionReport {
  questionId: string;
  reportCount: number;
  firstReportedAt: string;
  lastReportedAt: string;
}

interface AdminScreenProps {
  reports: QuestionReport[];
  onBack: () => void;
  onExport: () => void;
  onClearReports: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  reports,
  onBack,
  onExport,
  onClearReports,
}) => {
  // 報告回数の降順でソート
  const sortedReports = [...reports].sort((a, b) => b.reportCount - a.reportCount);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="screen">
      <button className="btn-back" onClick={onBack}>
        ← 戻る
      </button>

      <h2 className="screen-title">問題報告の管理</h2>

      {sortedReports.length === 0 ? (
        <div className="empty-history">
          <p>報告された問題はありません</p>
          <p className="empty-history-sub">
            ユーザーが問題の間違いを報告すると、ここに表示されます
          </p>
        </div>
      ) : (
        <>
          <div className="admin-summary">
            <p className="admin-summary-text">
              合計 <strong>{sortedReports.length}</strong> 件の問題が報告されています
            </p>
          </div>

          <div className="admin-list">
            {sortedReports.map((report) => (
              <div key={report.questionId} className="admin-report-item">
                <div className="admin-report-header">
                  <span className="admin-question-id">{report.questionId}</span>
                  <span className="admin-report-count">
                    報告回数: <strong>{report.reportCount}</strong>
                  </span>
                </div>
                <div className="admin-report-dates">
                  <div className="admin-date-item">
                    <span className="admin-date-label">初回報告:</span>
                    <span className="admin-date-value">
                      {formatDate(report.firstReportedAt)}
                    </span>
                  </div>
                  <div className="admin-date-item">
                    <span className="admin-date-label">最終報告:</span>
                    <span className="admin-date-value">
                      {formatDate(report.lastReportedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-actions">
            <button className="btn btn-secondary" onClick={onExport}>
              JSONをエクスポート
            </button>
            <button className="btn btn-danger" onClick={onClearReports}>
              報告をクリア
            </button>
          </div>
        </>
      )}
    </div>
  );
};
