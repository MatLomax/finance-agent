/**
 * Size Limit configuration for production bundle validation
 * Checks the built bundle.js file size
 */

export default [
  {
    name: "Production bundle (app code only)",
    path: "dist/bundle.js",
    limit: "25 KB",
    ignore: ["date-fns", "lodash-es", "uplot"]
  }
];
