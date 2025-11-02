import type { PostFilter } from "./utils/posts";

export interface SiteConfig {
  title: string;
  slogan: string;
  description?: string;
  site: string,
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
    rss?: boolean;
    support?: string;
  };
  homepage: PostFilter;
  googleAnalysis?: string;
  search?: boolean;
}

export const siteConfig: SiteConfig = {
  site: "https://echowane.github.io", // your site url
  title: "CSBLOG",
  slogan: "A minimal blog focused on Cybersecurity and Software Development",
  description: "Hi there! I'm Amir, a Cybersecurity master's student at Isfahan University of Technology. If you liked or found this blog useful, please consider supporting using the coffee link below!",
  social: {
    github: "https://www.github.com/EchoWane", // leave empty if you don't want to show the github
    linkedin: "https://www.linkedin.com/in/someone/", // leave empty if you don't want to show the linkedin
    email: "amir.rabiee2001@outlook.com", // leave empty if you don't want to show the email
    rss: true, // set this to false if you don't want to provide an rss feed
    support: "https://coffeebede.com/echowane", // leave empty if you don't want to show support link
  },
  homepage: {
    maxPosts: 5,
    tags: [],
    excludeTags: [],
  },
  googleAnalysis: "", // your google analysis id
  search: true, // set this to false if you don't want to provide a search feature
};
