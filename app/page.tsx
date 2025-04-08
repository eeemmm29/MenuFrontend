import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import clsx from "clsx";
import { Button } from "@heroui/button";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        {/* <span className={title()}>Make&nbsp;</span>
        <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
        <br />
        <span className={title()}>
          websites regardless of your design experience.
        </span> */}
        <span className={title()}>Restaurant Menu Management System</span>
        <div className={subtitle({ class: "mt-4" })}>
          {siteConfig.description}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          as={Link}
          href="/categories"
          color="primary"
          variant="shadow"
          className={clsx(
            buttonStyles({ color: "primary", variant: "shadow" }),
            "flex flex-col gap-1.5 min-h-48"
          )}
        >
          <span className={title({ size: "sm" })}>Categories</span>
          <span
            className={clsx(
              subtitle({ class: "text-sm" }),
              "flex flex-col items-center"
            )}
          >
            Manage menu categories
          </span>
        </Button>

        <Button
          as={Link}
          href="/menu-items"
          className={clsx(
            buttonStyles({ color: "primary", variant: "shadow" }),
            "flex flex-col gap-1.5 min-h-48"
          )}
        >
          <span className={title({ size: "sm" })}>Menu Items</span>
          <span
            className={clsx(
              subtitle({ class: "text-sm" }),
              "flex flex-col items-center"
            )}
          >
            Manage menu items and dishes
          </span>
        </Button>
      </div>

      <div className="flex gap-3">
        {/* <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link> */}
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      {/* <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div> */}
    </section>
  );
}
