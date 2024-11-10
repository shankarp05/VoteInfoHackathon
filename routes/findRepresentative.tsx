import LocationButton from "../islands/Location.tsx";

export default function Home() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold mb-4">Find Your State Representative</h1>
      <LocationButton />
    </div>
  );
}
