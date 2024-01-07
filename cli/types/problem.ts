export interface FileInterface {
  id: string;
  path: string;
  content: string;
}

export interface TemplateInterface {
  id: string;
  name: string;
  starterFiles: FileInterface[];
}

export interface ProblemInterface {
  id: string;
  slug: string;
  description: string;
  templates: TemplateInterface[];
}
