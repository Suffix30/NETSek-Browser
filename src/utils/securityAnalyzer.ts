import { SecurityAnalysis, Headers, Cookie } from '../types/browser';

export const analyzeRequest = async (url: string): Promise<SecurityAnalysis> => {
  try {
    const mockHeaders: Headers = {
      'Content-Security-Policy': "default-src 'self'",
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
    };

    const mockCookies: Cookie[] = [
      {
        name: 'session',
        value: 'abc123',
        domain: new URL(url).hostname,
        path: '/',
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 86400000),
      },
    ];

    const mockCertificate = {
      issuer: "Let's Encrypt Authority X3",
      validFrom: new Date(),
      validTo: new Date(Date.now() + 7776000000),
      subject: new URL(url).hostname,
    };

    return {
      headers: mockHeaders,
      cookies: mockCookies,
      certificates: mockCertificate,
    };
  } catch (error) {
    console.error('Security analysis failed:', error);
    return {
      headers: {},
      cookies: [],
      certificates: null,
    };
  }
};

export const analyzeHeaders = (headers: Headers): {
  security: { issue: string; severity: 'high' | 'medium' | 'low' }[];
} => {
  const issues: { issue: string; severity: 'high' | 'medium' | 'low' }[] = [];

  if (!headers['Content-Security-Policy']) {
    issues.push({
      issue: 'Missing Content Security Policy',
      severity: 'high',
    });
  }

  if (!headers['X-Frame-Options']) {
    issues.push({
      issue: 'Missing X-Frame-Options (Clickjacking Protection)',
      severity: 'medium',
    });
  }

  if (!headers['Strict-Transport-Security']) {
    issues.push({
      issue: 'Missing HSTS (HTTP Strict Transport Security)',
      severity: 'high',
    });
  }

  return { security: issues };
};

export const analyzeCookies = (cookies: Cookie[]): {
  security: { issue: string; severity: 'high' | 'medium' | 'low' }[];
} => {
  const issues: { issue: string; severity: 'high' | 'medium' | 'low' }[] = [];

  for (const cookie of cookies) {
    if (!cookie.secure) {
      issues.push({
        issue: `Cookie '${cookie.name}' is not secure`,
        severity: 'high',
      });
    }

    if (!cookie.httpOnly) {
      issues.push({
        issue: `Cookie '${cookie.name}' is not HttpOnly`,
        severity: 'medium',
      });
    }
  }

  return { security: issues };
};
