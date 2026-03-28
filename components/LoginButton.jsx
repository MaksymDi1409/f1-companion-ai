// components/LoginButton.jsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
        <span className="text-sm font-medium">{session.user.name}</span>
        <button 
          onClick={() => signOut()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Вийти
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn('google')} 
      className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 font-medium"
    >
      Увійти через Google
    </button>
  );
}
