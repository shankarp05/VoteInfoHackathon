import ChatboxIsland from "../islands/ChatboxIsland.tsx";

export default function Home() {
  return (
    <div class="main-container bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4 py-6">
      <header class="text-center mb-6">
        <h1 class="text-3xl font-bold text-blue-700 mb-2">Welcome to the Chat</h1>
        <p class="text-gray-600">Chat with our AI-powered assistant below.</p>
      </header>
      <ChatboxIsland />
      <footer class="mt-8 text-gray-500 text-sm">
        Powered by Deno Fresh • Gemini API Chat
      </footer>
    </div>
  );
}
