import type { PostFilter } from "./utils/posts";

export interface SiteConfig {
  title: string;
  slogan: string;
  description?: string;
  site: string,
  base: string,
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
  base: "/CSBLOG",
  title: "CSBLOG",
  slogan: "A minimal, multi-author blog focused on Cybersecurity and Software Development",
  description: "Hi there! I'm Amir, a Cybersecurity master's student at Isfahan University of Technology. I like to write about my learning journey. If you're intrested in contributing to this blog, head to the GitHub repository.",
  social: {
    github: "https://www.github.com/EchoWane/CSBLOG", // leave empty if you don't want to show the github
    linkedin: "https://www.linkedin.com/in/someone/", // leave empty if you don't want to show the linkedin
    email: "amir.rabiee2001@outlook.com", // leave empty if you don't want to show the email
    rss: true, // set this to false if you don't want to provide an rss feed
    support: "",
  },
  homepage: {
    maxPosts: 5,
    tags: [],
    excludeTags: [],
  },
  googleAnalysis: "", // your google analysis id
  search: true, // set this to false if you don't want to provide a search feature
};
