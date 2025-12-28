export type PagesType = {
  home: string;
  about: string;
  contact: string;
};

export type Project = {
  id: string;
  name: string;
  pages: PagesType;
  theme: string;
};
