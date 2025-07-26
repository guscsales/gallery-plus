import cx from "classnames";

interface MainContentProps extends React.ComponentProps<"main"> {}

export default function MainContent({
  children,
  className,
  ...props
}: MainContentProps) {
  return (
    <main className={cx("mt-20 pb-20", className)} {...props}>
      {children}
    </main>
  );
}
