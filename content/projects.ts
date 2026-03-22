import { Project } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    title: 'Elementary Web Grading System',
    description: 'A web-based grading system for elementary schools — streamlines grade management, student records, and report generation.',
    credentials: { username: 'test@gmail.con', password: '12345678' },
    tags: ['PHP', 'MySQL', 'CSS', 'jQuery', 'JavaScript'],
    image: '/images/ewgs.png',
    liveUrl: 'https://ewgs.infinityfreeapp.com/',
    repoUrl: 'https://github.com/Hisuwii/ewgs',
    featured: true,
  },
  {
    id: '2',
    title: 'Anime Manga App',
    description: 'A React Native mobile app for browsing anime and manga — features search, details, and a personal watchlist.',
    tags: ['React Native', 'TypeScript'],
    image: undefined,
    liveUrl: undefined,
    repoUrl: 'https://github.com/hisuwi/hisui-anime-manga',
    featured: false,
  },
]
