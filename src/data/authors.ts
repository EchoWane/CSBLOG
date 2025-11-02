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
    avatar: '/avatar.jpg',
    social: {
      github: 'https://www.github.com/EchoWane',
      linkedin: 'https://www.linkedin.com/in/someone/',
      email: 'amir.rabiee2001@outlook.com',
      support: 'https://coffeebede.com/echowane',
    },
  },
  'jane': {
    id: 'jane',
    name: 'Jane Doe',
    bio: 'Software engineer specializing in web development and security.',
    avatar: '/avatars/jane.jpg',
    social: {
      github: 'https://github.com/janedoe',
      email: 'jane@example.com',
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
