import { Image, RichTextBlock, StrictMeta } from "@sss/prismic";

export interface EducationCoursesDataType {
  educationCourses: {
    edges: { node: { _meta: StrictMeta; videos: { video: Video }[] } }[];
  };
}

export interface Video {
  _meta: StrictMeta;
  description: RichTextBlock[];
  descriptionTitle: RichTextBlock[];
  duration: number;
  seoDescription: string;
  seoTitle: string;
  socialMediaDescription: string;
  socialMediaTitle: string;
  summary: RichTextBlock[];
  thumbnail: Image | null;
  title: string;
  youtubeId: string;
}

interface EducationCourse {
  _meta: StrictMeta;
  courseHighlights: RichTextBlock[] | null;
  description: RichTextBlock[] | null;
  expert: Expert;
  heroImage: Image | null;
  klaviyoId: string;
  seoDescription: string;
  seoTitle: string;
  socialMediaDescription: string;
  socialMediaTitle: string;
  title: string;
  videos: { video: Video }[];
  youtubePlaylistUrl: string;
}

export interface Expert {
  name: RichTextBlock[];
  role: RichTextBlock[];
  summary: RichTextBlock[];
  image: Image;
  _meta: StrictMeta;
}

export interface EducationCourseDataType {
  educationCourse: EducationCourse;
}
