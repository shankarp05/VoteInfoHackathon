import ChatboxIsland from "../islands/ChatboxIsland.tsx";
import { Button } from "../components/ClickableButton.tsx";

export default function Home() {
  return (
    <div>
      <div class="relative">
        {/* Logo placed in the top-left corner */}
        <a href="/homeRedirect">
          <img src="/legisLinkLogo.png" alt="LegisLink Logo" class="absolute top-4 left-4 h-20" />
        </a>
        <h1 class="text-3xl font-bold text-blue-700 mb-2 text-center pt-7">Ask Me About Your Elected Officials!</h1>
        <p class="text-gray-600 text-center">Chat with our AI-powered assistant below.</p>
        <div class="absolute top-4 right-4 h-20">
          <Button text="Find Your Representatives" href="/findRepresentativeRedirect" />
        </div>
      </div>

      <div class="main-container bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4 py-6">
        <p>Try These Starter Prompts!</p>
        <ChatboxIsland />
        <footer class="mt-8 text-gray-500 text-sm">
          Powered by Deno Fresh🍋 and Gemini
        </footer>
      </div>
    </div>
  );
}
