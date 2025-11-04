import { siteConfig } from "../config";

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  social?: {
    github?: string;
    linkedin?: string;
    email?: string;
    support?: string;
  };
}

export const authors: Record<string, Author> = {
  'amir': {
    id: 'amir',
    name: 'Amir Rabiee',
    bio: 'Cybersecurity master\'s student at Isfahan University of Technology. Passionate about security research and software development.',
    avatar: `${siteConfig.base}/default.png`,
    social: {
      github: 'https://www.github.com/EchoWane',
      // linkedin: 'https://www.linkedin.com/in/someone/',
      email: 'amir.rabiee2001@outlook.com',
      // support: "https://www.buymeacoffee.com/echowane",
    },
  },
};

// Helper function to get author by ID
export function getAuthor(id: string): Author | undefined {
  return authors[id];
}

// Helper function to get multiple authors
export function getAuthors(ids: string[]): Author[] {
  return ids.map(id => authors[id]).filter(Boolean);
}

// Helper function to get all authors
export function getAllAuthors(): Author[] {
  return Object.values(authors);
}
