import Cookie from 'js-cookie';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ensureLogin(history: any) {
  console.log(Cookie.get('connect.sid'));
  if (!Cookie.get('connect.sid')) {
    history.push(`/auth/login?return=${history.location.pathname}${history.location.search}`);
  }
}