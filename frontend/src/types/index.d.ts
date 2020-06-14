declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.png' {
  const file: string;
  export default file;
}

