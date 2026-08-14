// tina/fields/image-path.ts
// Normalizes Tina image fields to store absolute (`/uploads/...`) paths so the
// frontend can use the value directly as an `<Image src>`, while still working
// with repo-based media (which returns media-root-relative paths like
// `uploads/foo.webp` without a leading slash).
const withLeadingSlash = (value: string) => {
  if (!value) return value;
  return value.startsWith('/') ? value : `/${value}`;
};

export const imagePath = {
  parse: withLeadingSlash,
  format: withLeadingSlash,
};
