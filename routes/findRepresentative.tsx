import LocationButton from "../islands/Location.tsx";

export default function Home() {
  return (
    <div>
      <div class="relative">
        {/* Logo placed in the top-left corner */}
        <a href="/homeRedirect">
        <img src="/legisLinkLogo.png" alt="LegisLink Logo" class="absolute top-4 left-4 h-20" />
        </a>
        <h1 class="text-3xl font-bold text-blue-700 mb-2 text-center pt-7">Find Your State Representative</h1>
        <p class="text-gray-600 text-center pb-4">Find out who represents you and their contact information.</p>
      </div>

      <div class="button-container bg-gray-100 min-h-screen flex flex-col items-center px-4 py-6">
        {/* Location Button */}
        <LocationButton />
        
        <footer class="mt-8 text-gray-500 text-sm">
        Powered by Deno Fresh🍋 and Gemini
        </footer>
      </div>
    </div>
  );
}
