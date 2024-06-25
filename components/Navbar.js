import Link from "next/link";

export default () => {
  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <Link href={"/"} className="text-3xl px-2 flex items-center">
          <img src="logo.png" height={34} width={34} className="mr-2" />
          OpnChart
        </Link>
      </div>
    </div>
  );
};
