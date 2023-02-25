import { SUPPORTERS } from "@/const";

interface OurSupportersProps {}

interface ISupporter {
  name: string;
  title: string;
  logo: string;
  href: string;
}

function Supporter({ supporter }: { supporter: ISupporter }) {
  return (
    <a
      className="flex h-fit w-fit cursor-pointer flex-col rounded-lg bg-white py-5 px-10 shadow-lg shadow"
      href={supporter.href}
      target="_blank"
    >
      <h3 className="mb-2 text-center">{supporter.title}</h3>
      <img src={supporter.logo} width="100" alt={supporter.name} />
    </a>
  );
}

export default function OurSupporters({}: OurSupportersProps) {
  return (
    <div className="flex gap-3">
      {SUPPORTERS.map((supporter) => {
        return <Supporter supporter={supporter} />;
      })}
    </div>
  );
}
