import React, { useEffect, useState } from 'react';
import { Shield, Cookie, FileJson, AlertTriangle } from 'lucide-react';
import { SecurityAnalysis } from '../types/browser';
import { analyzeHeaders, analyzeCookies } from '../utils/securityAnalyzer';

interface SecurityIssue {
  issue: string;
  severity: 'high' | 'medium' | 'low';
}

export const SecurityPanel: React.FC<{ analysis: SecurityAnalysis }> = ({ analysis }) => {
  const [headerIssues, setHeaderIssues] = useState<SecurityIssue[]>([]);
  const [cookieIssues, setCookieIssues] = useState<SecurityIssue[]>([]);

  useEffect(() => {
    const { security: hIssues } = analyzeHeaders(analysis.headers);
    const { security: cIssues } = analyzeCookies(analysis.cookies);
    setHeaderIssues(hIssues);
    setCookieIssues(cIssues);
  }, [analysis]);

  const getSeverityColor = (severity: SecurityIssue['severity']) => {
    switch (severity) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
    }
  };

  return (
    <div className="bg-gray-900 border-t border-cyan-500 h-64 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Shield className="text-cyan-500 mr-2" />
              <h3 className="text-white font-medium">Headers</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(analysis.headers).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="text-cyan-500">{key}:</span>
                  <span className="text-gray-300 ml-2">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Cookie className="text-cyan-500 mr-2" />
              <h3 className="text-white font-medium">Cookies</h3>
            </div>
            <div className="space-y-2">
              {analysis.cookies.map((cookie) => (
                <div key={cookie.name} className="text-sm">
                  <div className="text-cyan-500">{cookie.name}</div>
                  <div className="text-gray-300 text-xs">
                    Domain: {cookie.domain}
                    <br />
                    Secure: {cookie.secure ? 'Yes' : 'No'}
                    <br />
                    HttpOnly: {cookie.httpOnly ? 'Yes' : 'No'}
                    {cookie.expires && (
                      <>
                        <br />
                        Expires: {cookie.expires.toLocaleString()}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FileJson className="text-cyan-500 mr-2" />
              <h3 className="text-white font-medium">SSL Certificate</h3>
            </div>
            {analysis.certificates ? (
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-cyan-500">Issuer:</span>
                  <span className="text-gray-300 ml-2">
                    {analysis.certificates.issuer}
                  </span>
                </div>
                <div>
                  <span className="text-cyan-500">Valid From:</span>
                  <span className="text-gray-300 ml-2">
                    {analysis.certificates.validFrom.toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-cyan-500">Valid To:</span>
                  <span className="text-gray-300 ml-2">
                    {analysis.certificates.validTo.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">No SSL certificate found</div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="text-yellow-500 mr-2" />
              <h3 className="text-white font-medium">Security Issues</h3>
            </div>
            <div className="space-y-2">
              {[...headerIssues, ...cookieIssues].map((issue, index) => (
                <div
                  key={index}
                  className={`text-sm ${getSeverityColor(issue.severity)}`}
                >
                  • {issue.issue}
                </div>
              ))}
              {headerIssues.length === 0 && cookieIssues.length === 0 && (
                <div className="text-green-500 text-sm">
                  No security issues found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};