import Header from "@/components/homePage/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen p-8 md:p-16 md:px-20">
        <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl md:text-6xl font-semibold font-barlow italic mb-4">
              Join Group Trips. Meet Like Minded Travelers.
              <br />
              Around the World!
            </h1>
          </div>
        </div>
      </main>
    </>
  );
}
