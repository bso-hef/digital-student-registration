// Type declarations for CSS imports
// This file provides TypeScript type definitions for importing CSS files

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Support for CSS modules with .module.css extension
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// Support for SCSS if needed in the future
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
