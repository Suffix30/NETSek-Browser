export interface Headers {
  [key: string]: string;
}

export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: Date;
  httpOnly: boolean;
  secure: boolean;
}

export interface RequestData {
  url: string;
  method: string;
  headers: Headers;
  cookies: Cookie[];
}

export interface SecurityAnalysis {
  headers: Headers;
  cookies: Cookie[];
  certificates: {
    issuer: string;
    validFrom: Date;
    validTo: Date;
    subject: string;
  } | null;
}