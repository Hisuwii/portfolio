import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const stored = process.env.ADMIN_PASSWORD
        if (!stored || !credentials?.password) return null
        if (credentials.password !== stored) return null
        return { id: '1', name: 'Admin' }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
})
