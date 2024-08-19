interface JwtPayload {
    sub: string;
    authorities: string[];
    payload: {
      role: string;
      nome: string;
      id: number;
      endpoints: string[];
    };
    iat: number;
    exp: number;
  }
  
  export const decodeBase64Url = (str: string): string => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  
    return jsonPayload;
  };

  export const extractPayload = (token: string): JwtPayload => {
    const base64UrlPayload = token.split('.')[1];
    const jsonPayload = decodeBase64Url(base64UrlPayload);
    return JSON.parse(jsonPayload) as JwtPayload;
  };

  export const getPayloadData = (token: string): { role: string; id: number ; nome : string} => {
    const payload = extractPayload(token);
    const { role, id, nome } = payload.payload;
    return { role, id, nome };
  };
  