import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-center items-center h-[92vh]">
      <div>
        <Link href="/charts">
          <div className="btn btn-primary text-xl">Generate Charts</div>
        </Link>
      </div>
    </main>
  );
}
