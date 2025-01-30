import { auth } from "@/auth";
import { redirect } from "next/navigation";

import BlogForm from "@/components/BlogForm";

async function Page() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Submit Your Blogs!</h1>
      </section>

      <BlogForm />
    </>
  );
}

export default Page;
