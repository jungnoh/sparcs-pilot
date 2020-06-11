// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ensureLogin(history: any) {
  if (sessionStorage.getItem('username') === null) {
    history.push(`/auth/login?return=${history.location.pathname}${history.location.search}`);
  }
}